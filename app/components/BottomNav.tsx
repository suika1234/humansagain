"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/history",
      label: "Insights",
      icon: BarChart3,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-orange-200 backdrop-blur-sm z-50 shadow-lg">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "text-orange-500"
                    : "text-slate-400 hover:text-orange-400"
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? "text-orange-500" : "text-slate-400"}`} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-orange-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
