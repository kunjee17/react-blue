import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { AuthProvider, useAuth } from "./providers/auth";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root");

function InnerApp() {
	const auth = useAuth();
	return <RouterProvider router={router} context={{ auth }} />;
}

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<InnerApp />
				</AuthProvider>
			</QueryClientProvider>
		</StrictMode>,
	);
} else {
	console.error("No root element found");
}
