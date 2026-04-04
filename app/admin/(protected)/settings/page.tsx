import { ChangePasswordForm } from "@/components/admin/change-password-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-black/5">
      <h1 className="mb-2 font-[family-name:var(--font-montserrat)] text-2xl font-bold text-[#083D6B]">
        Account
      </h1>
      <p className="mb-6 text-sm text-[#42474f]">
        Enter your current password, then choose a new one.
      </p>
      <ChangePasswordForm />
      <p className="mt-6 text-center text-sm">
        <Link href="/" className="font-semibold text-[#083D6B] hover:underline">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
