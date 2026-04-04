import { LoginForm } from "@/components/admin/login-form";
import Link from "next/link";
import { Suspense } from "react";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F4F5F7] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-black/5">
        <h1 className="mb-2 text-center font-[family-name:var(--font-montserrat)] text-2xl font-bold text-[#083D6B]">
          Admin sign in
        </h1>
        <p className="mb-6 text-center text-sm text-[#42474f]">
          Manchester Mobile Mechanic
        </p>
        <Suspense fallback={<p className="text-center text-sm text-[#42474f]">Loading…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="font-semibold text-[#083D6B] hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
