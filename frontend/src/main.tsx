import { createRoot } from "react-dom/client";
import { queryClient } from "./lib/query-client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <App/>
    </QueryClientProvider>
);
