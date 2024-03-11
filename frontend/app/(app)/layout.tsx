import Link from "next/link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Suggestions" },
  { href: "/meals", label: "Browse Meals" },
  { href: "/planner", label: "Planner" },
  { href: "/favourites", label: "Favourites" },
  { href: "/pantry", label: "Pantry" },
  { href: "/profile", label: "Profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between bg-[--color-primary] px-6 py-3 text-white">
        <span className="text-lg font-semibold">NutriSuggest</span>
        <nav className="flex gap-4 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[--color-accent]">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
    </div>
  );
}
