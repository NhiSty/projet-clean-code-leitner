import { NavBar } from "@/components/navbar";
import { Outlet } from "react-router-dom";

export function MainLayout(): JSX.Element {
  return (
    <>
      <header>
        <NavBar />
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
