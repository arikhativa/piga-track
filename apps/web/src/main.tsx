import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "#/routes/App";

// biome-ignore lint/style/noNonNullAssertion: react init
const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);

	root.render(
		<BrowserRouter>
			<App />
		</BrowserRouter>,
	);
}
