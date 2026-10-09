import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HISTORY_KEY = "app-navigation-history";

export function useGoBack() {
	const navigate = useNavigate();
	const location = useLocation();

	const [canGoBack, setCanGoBack] = useState(false);

	useEffect(() => {
		const history: string[] = JSON.parse(
			sessionStorage.getItem(HISTORY_KEY) ?? "[]",
		);

		const previousIndex = history.lastIndexOf(location.key);

		if (previousIndex !== -1) {
			history.splice(previousIndex + 1);
		} else {
			history.push(location.key);
		}

		sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
		setCanGoBack(history.length > 1);
	}, [location.key]);

	const goBack = useCallback(() => {
		if (canGoBack) {
			navigate(-1);
		}
	}, [canGoBack, navigate]);

	return {
		goBack,
		isFirstPage: !canGoBack,
	};
}
