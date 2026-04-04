import { signOut } from "@/app/admin/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4 shadow-sm">
        <Link href="/" className="text-lg font-bold text-[#083D6B]">
          Manchester Mobile Mechanic — Admin
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="text-sm font-semibold text-[#42474f] hover:text-[#083D6B]">
            Edit on site
          </Link>
          <Link
            href="/admin/settings"
            className="text-sm font-semibold text-[#42474f] decoration-[#E6B31E] decoration-2 underline-offset-4 hover:text-[#E6B31E] hover:underline"
          >
            Change password
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg bg-[#083D6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#062f55]"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="px-4 py-8">{children}</div>
    </div>
  );
}
