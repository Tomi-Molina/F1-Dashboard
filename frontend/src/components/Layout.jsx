import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg-primary bg-grid flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>
      <footer className="border-t border-border text-center py-4 text-sm text-neutral-600 font-mono">
        F1 Dashboard &mdash; Portfolio Project &mdash; Data: 2023 Season
      </footer>
    </div>
  );
}
