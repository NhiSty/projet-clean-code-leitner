import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { queryClient } from "./api/fetcher";

export function App(): JSX.Element {
  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </main>
  );
}
