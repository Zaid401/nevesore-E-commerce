"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase sends the user back with a fragment: #access_token=...&type=recovery
    // onAuthStateChange fires a PASSWORD_RECOVERY event when Supabase detects it.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message || "Failed to update password. Please request a new reset link.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navbar />
      <section className="relative flex justify-center px-4 py-21 sm:px-6 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative w-full max-w-md">
          <div className="rounded-4xl border border-neutral-200 bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.1)] sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 sm:gap-6 lg:gap-6">
              <header className="flex flex-col gap-2 text-left">
                <h1 className="text-xl font-extrabold uppercase text-neutral-900 sm:text-2xl lg:text-2xl">
                  Set New Password
                </h1>
                <p className="text-xs text-neutral-600 sm:text-sm lg:text-sm">
                  Choose a strong password for your account.
                </p>
              </header>

              {success ? (
                <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-4 text-xs text-green-700 sm:text-sm">
                  <p className="font-bold uppercase">Password updated!</p>
                  <p className="mt-1">Your password has been changed successfully. Redirecting you to sign in…</p>
                </div>
              ) : !sessionReady ? (
                <div className="flex flex-col gap-4 text-center">
                  <p className="text-xs text-neutral-500 sm:text-sm">
                    Waiting for the reset link to be verified. If you arrived here by clicking the email link, it should activate automatically. If nothing happens, the link may have expired.
                  </p>
                  <Link href="/login" className="text-[10px] uppercase text-red-600 hover:text-red-700 sm:text-xs">
                    Back to Sign In
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6 lg:gap-6">
                  {error && (
                    <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600 sm:text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase text-neutral-600 sm:text-xs lg:text-xs">
                    <label htmlFor="new-password">New Password</label>
                    <div className="relative flex items-center">
                      <input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 pr-12 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 sm:h-12 sm:px-5 sm:text-sm lg:h-12 lg:px-5 lg:text-sm"
                        required
                        minLength={6}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 transition-colors hover:text-neutral-700 sm:h-8 sm:w-8"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                          <path fill="currentColor" d="M12 5c-5.05 0-9.27 3.11-11 7.5 1.73 4.39 5.95 7.5 11 7.5s9.27-3.11 11-7.5C21.27 8.11 17.05 5 12 5m0 12a4.5 4.5 0 1 1 4.5-4.5A4.5 4.5 0 0 1 12 17m0-7a2.5 2.5 0 1 0 2.5 2.5A2.5 2.5 0 0 0 12 10" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase text-neutral-600 sm:text-xs lg:text-xs">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 rounded-2xl border border-neutral-300 bg-neutral-50 px-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 sm:h-12 sm:px-5 sm:text-sm lg:h-12 lg:px-5 lg:text-sm"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 rounded-2xl bg-red-600 text-xs font-bold uppercase text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 sm:h-12 sm:text-sm lg:h-12 lg:text-sm"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>

                  <Link href="/login" className="text-center text-[10px] uppercase text-neutral-500 hover:text-neutral-900 sm:text-xs">
                    Back to Sign In
                  </Link>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
