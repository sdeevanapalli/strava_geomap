"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart, Flame, User, Settings } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/", icon: BarChart },
    { name: "Personal Records", href: "/pr", icon: Flame },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-bold text-orange-500">
          StravaGeoMap
        </Link>
        <div className="flex gap-6">
          {links.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                pathname === href
                  ? "text-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
