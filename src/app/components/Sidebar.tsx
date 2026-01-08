"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, UserCircle, FileText, LogOut } from "lucide-react";
import Cookies from "js-cookie";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Profile", icon: UserCircle, href: "/profile" },
  { name: "CV Generator", icon: FileText, href: "/generate" },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Remove the token from cookies
    Cookies.remove("token");

    localStorage.removeItem("token");

    // Redirect to the landing page
    router.push("/");

    // Force a refresh to reset all React states/contexts
    router.refresh();
  };

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 p-6 flex flex-col">
      <div className="text-2xl font-bold text-emerald-400 mb-10 px-2">
        AppliTrack
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                isActive
                  ? "bg-slate-800 text-emerald-400"
                  : "text-white hover:bg-slate-800"
              }`}
            >
              <item.icon
                size={20}
                className={`transition-colors ${
                  isActive
                    ? "text-emerald-400"
                    : "text-slate-400 group-hover:text-emerald-400"
                }`}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* The Sign Out Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors mt-auto group w-full"
      >
        <LogOut
          size={20}
          className="group-hover:translate-x-1 transition-transform"
        />
        <span className="font-medium">Sign Out</span>
      </button>
    </aside>
  );
}
