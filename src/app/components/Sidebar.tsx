"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Profile", icon: UserCircle, href: "/profile" },
  { name: "CV Generator", icon: FileText, href: "/generate" },
];

export function Sidebar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    router.push("/");
    router.refresh();
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* The Sidebar */}
      <aside
        className={`
        fixed left-0 top-0 h-screen bg-slate-900 text-white p-6 flex flex-col z-40 transition-transform duration-300 ease-in-out
        w-64 lg:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      `}
      >
        {/* Logo Section */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="text-2xl font-bold text-emerald-400 mb-10 px-2 flex justify-between items-center hover:text-emerald-300 transition-colors"
        >
          AppliTrack
        </Link>

        {/* Credit Balance Card at the bottom */}
        {/* Live Credit Display */}
        {/* <div className="mt-auto p-4 mx-4 mb-6 bg-slate-800 rounded-xl border border-slate-700">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
            Available Credits
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-bold text-emerald-400">
              {user?.credits ?? 0}
            </span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div> */}
        {/* Credit Display Section */}
        <div className="mt-auto px-4 mb-6">
          <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl space-y-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                Your Balance
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                {user?.credits ?? 0} Credits
              </p>
            </div>

            <Link href="/dashboard/billing">
              <Button
                variant="secondary"
                className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-none font-bold text-xs h-9"
              >
                Top Up Now
              </Button>
            </Link>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
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
