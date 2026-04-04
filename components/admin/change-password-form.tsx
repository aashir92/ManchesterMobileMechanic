"use client";

import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

const MIN_LEN = 8;

function PasswordField({
  id,
  label,
  autoComplete,
  value,
  onChange,
  show,
  onToggleShow,
}: {
  id: string;
  label: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
}) {
  return (
    <label className="block text-sm font-medium text-[#42474f]" htmlFor={id}>
      {label}
      <div className="relative mt-1">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-black/15 py-2 pl-3 pr-11"
          required
          minLength={id === "current-password" ? undefined : MIN_LEN}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center justify-center rounded-r-lg px-3 text-[#42474f] transition-colors hover:text-[#083D6B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#083D6B]"
          onClick={onToggleShow}
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {show ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
        </button>
      </div>
    </label>
  );
}

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [nextPw, setNextPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (nextPw.length < MIN_LEN) {
      setError(`New password must be at least ${MIN_LEN} characters.`);
      return;
    }
    if (nextPw !== confirm) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (nextPw === current) {
      setError("New password must be different from your current password.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const email = user?.email;
    if (!email) {
      setLoading(false);
      setError("Could not read your account email. Try signing in again.");
      return;
    }

    const { error: signErr } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    });
    if (signErr) {
      setLoading(false);
      setError("Current password is incorrect.");
      return;
    }

    const { error: updateErr } = await supabase.auth.updateUser({
      password: nextPw,
    });
    setLoading(false);

    if (updateErr) {
      setError(updateErr.message);
      return;
    }

    setCurrent("");
    setNextPw("");
    setConfirm("");
    setSuccess("Password updated successfully.");
  }

  let alert: ReactNode = null;
  if (error) {
    alert = (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
        {error}
      </p>
    );
  } else if (success) {
    alert = (
      <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900" role="status">
        {success}
      </p>
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
      <PasswordField
        id="current-password"
        label="Current password"
        autoComplete="current-password"
        value={current}
        onChange={setCurrent}
        show={showCurrent}
        onToggleShow={() => setShowCurrent((v) => !v)}
      />
      <PasswordField
        id="new-password"
        label="New password"
        autoComplete="new-password"
        value={nextPw}
        onChange={setNextPw}
        show={showNext}
        onToggleShow={() => setShowNext((v) => !v)}
      />
      <PasswordField
        id="confirm-password"
        label="Confirm new password"
        autoComplete="new-password"
        value={confirm}
        onChange={setConfirm}
        show={showConfirm}
        onToggleShow={() => setShowConfirm((v) => !v)}
      />
      <p className="text-xs text-[#42474f]">Use at least {MIN_LEN} characters for your new password.</p>
      {alert}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#083D6B] py-3 font-semibold text-white hover:bg-[#062f55] disabled:opacity-60"
      >
        {loading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
