import { type ASTNode, Environment } from "@marcbachmann/cel-js";

const searchEnvironment = new Environment({
	unlistedVariablesAreDyn: true,
	limits: { maxAstNodes: 100, maxDepth: 20 },
});

const comparisonOperators = {
	"==": "eq",
	"!=": "neq",
	">": "gt",
	">=": "gte",
	"<": "lt",
	"<=": "lte",
} as const;

const reversedOperators = {
	"==": "eq",
	"!=": "neq",
	">": "lt",
	">=": "lte",
	"<": "gt",
	"<=": "gte",
} as const;

const descriptionFields = new Set(["description", "desc", "d"]);
const logicalOperators: Record<string, string> = {
	"&": "&&",
	"&&": "&&",
	and: "&&",
	"|": "||",
	"||": "||",
	or: "||",
};

// Keep quoted literals and whole identifiers intact. Bare description values
// extend to the next logical operator or closing parenthesis, not just one word.
const normalizeSearchExpression = (text: string) => {
	const tokens =
		text.match(
			/[rR]?(?:"""(?:\\[\s\S]|(?!""")[^\\])*"""|'''(?:\\[\s\S]|(?!''')[^\\])*'''|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')|[\p{L}_][\p{L}\p{N}_]*|&&?|\|\|?|==|!=|\s+|[\s\S]/gu,
		) ?? [];
	const nextNonWhitespace = (start: number) => {
		let index = start;
		while (index < tokens.length && /^\s+$/.test(tokens[index])) index++;
		return index;
	};
	const normalized: string[] = [];

	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];
		if (descriptionFields.has(token)) {
			const operatorIndex = nextNonWhitespace(index + 1);
			const operator = tokens[operatorIndex];
			if (operator === "==" || operator === "!=") {
				const valueStart = nextNonWhitespace(operatorIndex + 1);
				if (
					valueStart < tokens.length &&
					!/^[rR]?["']/.test(tokens[valueStart])
				) {
					let end = valueStart;
					while (
						end < tokens.length &&
						!Object.hasOwn(logicalOperators, tokens[end]) &&
						tokens[end] !== ")"
					)
						end++;
					const value = tokens.slice(valueStart, end).join("").trim();
					if (value) {
						normalized.push(
							tokens.slice(index, valueStart).join(""),
							JSON.stringify(value),
							" ",
						);
						index = end - 1;
						continue;
					}
				}
			}
		}
		normalized.push(
			Object.hasOwn(logicalOperators, token) ? logicalOperators[token] : token,
		);
	}

	return normalized.join("");
};

const amountKind = (node: ASTNode) => {
	if (node.op !== "id") return undefined;
	switch (node.args) {
		case "a":
		case "amount":
		case "amount_nis":
			return "amount";
		case "e":
		case "expense":
		case "expanse":
			return "expense";
		case "i":
		case "income":
			return "income";
		default:
			return undefined;
	}
};

const isDescription = (node: ASTNode) =>
	node.op === "id" && descriptionFields.has(node.args);

const numericLiteral = (node: ASTNode): number | bigint | undefined => {
	if (node.op === "-_") {
		const value = numericLiteral(node.args);
		return value === undefined ? undefined : -value;
	}
	if (node.op !== "value") return undefined;
	const value = node.args;
	return typeof value === "bigint" ||
		(typeof value === "number" && Number.isFinite(value))
		? value
		: undefined;
};

// Translate only the supported CEL subset, never execute user expressions or
// filter a single page locally: PostgREST must compute the count and pagination.
const searchPredicate = (node: ASTNode): string | undefined => {
	const kind = amountKind(node);
	if (kind === "expense") return "amount_nis.lt.0";
	if (kind === "income") return "amount_nis.gt.0";

	if (node.op === "&&" || node.op === "||") {
		const left = searchPredicate(node.args[0]);
		const right = searchPredicate(node.args[1]);
		if (!left || !right) return undefined;
		return `${node.op === "&&" ? "and" : "or"}(${left},${right})`;
	}

	switch (node.op) {
		case "==":
		case "!=":
		case ">":
		case ">=":
		case "<":
		case "<=": {
			const [left, right] = node.args;
			if (node.op === "==" || node.op === "!=") {
				const [field, literal] = isDescription(left)
					? [left, right]
					: [right, left];
				if (
					isDescription(field) &&
					literal.op === "value" &&
					typeof literal.args === "string"
				) {
					const operator = node.op === "==" ? "ilike" : "not.ilike";
					return `description.${operator}.${JSON.stringify(`*${literal.args}*`)}`;
				}
			}

			const reversed = amountKind(right) !== undefined;
			const fieldKind = amountKind(reversed ? right : left);
			if (!fieldKind) return undefined;
			const value = numericLiteral(reversed ? left : right);
			if (value === undefined) return undefined;

			// For expenses, abs(amount_nis) = -amount_nis. Negating both
			// sides reverses the comparison as well as the threshold's sign.
			const flip = reversed !== (fieldKind === "expense");
			const operator = (flip ? reversedOperators : comparisonOperators)[
				node.op
			];
			const threshold = fieldKind === "expense" ? -value : value;
			const comparison = `amount_nis.${operator}.${threshold}`;
			if (fieldKind === "expense") {
				return `and(amount_nis.lt.0,${comparison})`;
			}
			if (fieldKind === "income") {
				return `and(amount_nis.gt.0,${comparison})`;
			}
			return comparison;
		}
		default:
			return undefined;
	}
};

export const transactionSearchFilter = (
	search: string,
): Record<string, string> => {
	const text = search.trim();
	if (!text) return {};

	let predicate: string | undefined;
	try {
		const { ast } = searchEnvironment.parse(normalizeSearchExpression(text));
		const value = numericLiteral(ast);
		if (value === undefined) {
			predicate = searchPredicate(ast);
		} else if (typeof value === "bigint" || Number.isInteger(value)) {
			// Match amounts whose floor or ceiling equals the searched magnitude.
			const magnitude = value < 0 ? -value : value;
			const lower =
				typeof magnitude === "bigint" ? magnitude - 1n : magnitude - 1;
			const upper =
				typeof magnitude === "bigint" ? magnitude + 1n : magnitude + 1;
			predicate =
				"or(and(amount_nis.gt." +
				lower +
				",amount_nis.lt." +
				upper +
				"),and(amount_nis.gt." +
				-upper +
				",amount_nis.lt." +
				-lower +
				"))";
		} else {
			predicate = `or(amount_nis.eq.${value},amount_nis.eq.${-value})`;
		}
	} catch {
		// Plain text and unfinished expressions remain description searches.
	}

	if (!predicate) return { "description@ilike": text };

	// Preserve the provider's all-words description search. Quote each value so
	// commas, parentheses, quotes and backslashes cannot alter the filter tree.
	const description = text
		.split(/\s+/)
		.map((word) => `description.ilike.${JSON.stringify(`*${word}*`)}`)
		.join(",");

	// An empty operator passes the complete logical filter through unchanged.
	return { "or@": `(and(${description}),${predicate})` };
};
