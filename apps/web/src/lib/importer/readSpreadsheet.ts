import * as XLSX from "xlsx";

export async function readSpreadsheet(file: File) {
	const buffer = await file.arrayBuffer();

	const workbook = XLSX.read(buffer, {
		type: "array",
	});

	const sheet = workbook.Sheets[workbook.SheetNames[0]];

	const rows = XLSX.utils.sheet_to_json(sheet, {
		header: 1,
		raw: false,
	});

	return rows as unknown[][];
}
