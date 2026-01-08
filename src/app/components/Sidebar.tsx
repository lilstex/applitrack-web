"use client";

import { useState } from "react"; // [!code ++]
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  LogOut,
  Menu, // [!code ++]
  X, // [!code ++]
} from "lucide-react";
import Cookies from "js-cookie";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Profile", icon: UserCircle, href: "/profile" },
  { name: "CV Generator", icon: FileText, href: "/generate" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // [!code ++]
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    router.push("/");
    router.refresh();
  };

  const toggleSidebar = () => setIsOpen(!isOpen); // [!code ++]

  return (
    <>
      {/* 1. Mobile Toggle Button - Only visible on small screens */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 2. Backdrop Overlay - Only visible when menu is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* 3. The Sidebar - Fixed on Desktop, Slide-in on Mobile */}
      <aside
        className={`
        fixed left-0 top-0 h-screen bg-slate-900 text-white p-6 flex flex-col z-40 transition-transform duration-300 ease-in-out
        w-64 lg:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      `}
      >
        <div className="text-2xl font-bold text-emerald-400 mb-10 px-2 flex justify-between items-center">
          AppliTrack
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close on navigation [!code ++]
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
    </>
  );
}
