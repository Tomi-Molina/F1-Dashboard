import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/compare", label: "Driver Comparison" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/90 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 flex items-center h-14 gap-8">
        {/* Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-f1-red rounded flex items-center justify-center font-display font-bold text-white text-sm tracking-tight select-none">
            F1
          </div>
          <span className="font-display font-bold text-lg tracking-wide text-white hidden sm:block">
            DASHBOARD
          </span>
        </NavLink>

        {/* Nav links */}
        <nav className="flex items-center gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded text-sm font-body transition-colors ${
                  isActive
                    ? "bg-f1-red/10 text-f1-red font-semibold"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right tag */}
        <span className="hidden md:block font-mono text-xs text-neutral-600 border border-border px-2 py-1 rounded">
          2023 Season
        </span>
      </div>
    </header>
  );
}
