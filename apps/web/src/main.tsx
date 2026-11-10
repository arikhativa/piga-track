import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "#/routes/App";

// biome-ignore lint/style/noNonNullAssertion: react init
const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);

	root.render(
		// NOTE: the useTransitions={false} is to fix a react rerender loop when a unauth user goes to home page
		// if we don't set useTransitions={false} and we still have 'requireAuth' in App then we get to loop
		<BrowserRouter useTransitions={false}>
			<App />
		</BrowserRouter>,
	);
}
