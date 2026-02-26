"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useAuth } from "@/context/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password, fullName);

    if (signUpError) {
      setError(signUpError.message || "Failed to create account. Please try again.");
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Show success message for 2 seconds then redirect to login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-neutral-50 text-neutral-900">
        <Navbar />
        <section className="relative flex justify-center px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative w-full max-w-md">
            <div className="rounded-4xl border border-neutral-200 bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.1)] sm:p-8 lg:p-10">
              <div className="flex flex-col items-center gap-5 text-center sm:gap-6 lg:gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 sm:h-16 sm:w-16 lg:h-16 lg:w-16">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-green-600 sm:h-8 sm:w-8 lg:h-8 lg:w-8" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold uppercase text-neutral-900 sm:text-2xl lg:text-2xl">
                    Account Created!
                  </h1>
                  <p className="text-xs text-neutral-600 mt-2 sm:text-sm lg:text-sm">
                    Please check your email to verify your account.
                  </p>
                </div>
                <p className="text-[10px] text-neutral-500 sm:text-xs lg:text-xs">
                  Redirecting to login...
                </p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navbar />
      <section className="relative flex justify-center px-4 py-16 sm:px-6 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative w-full max-w-md">
          <div className="rounded-4xl border border-neutral-200 bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.1)] sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 sm:gap-6 lg:gap-6">
              <header className="flex flex-col gap-2 text-left">
                <h1 className="text-xl font-extrabold uppercase text-neutral-900 sm:text-2xl lg:text-2xl">
                  Join The Movement
                </h1>
                <p className="text-xs text-neutral-600 sm:text-sm lg:text-sm">
                  Create your account and start your fitness journey.
                </p>
              </header>

              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600 sm:text-sm lg:text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6 lg:gap-6">
                <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase text-neutral-600 sm:text-xs lg:text-xs">
                  <label htmlFor="signup-name">Full Name</label>
                  <input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="enter your full name"
                    className="h-11 rounded-2xl border border-neutral-300 bg-neutral-50 px-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 sm:h-12 sm:px-5 sm:text-sm lg:h-12 lg:px-5 lg:text-sm"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase text-neutral-600 sm:text-xs lg:text-xs">
                  <label htmlFor="signup-email">Email Address</label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="enter your email address"
                    className="h-11 rounded-2xl border border-neutral-300 bg-neutral-50 px-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 sm:h-12 sm:px-5 sm:text-sm lg:h-12 lg:px-5 lg:text-sm"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase text-neutral-600 sm:text-xs lg:text-xs">
                  <label htmlFor="signup-password">Password</label>
                  <div className="relative flex items-center">
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 pr-12 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 sm:h-12 sm:px-5 sm:text-sm lg:h-12 lg:px-5 lg:text-sm"
                      required
                      disabled={loading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 transition-colors hover:text-neutral-700 sm:h-8 sm:w-8 lg:h-8 lg:w-8"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                        <path
                          fill="currentColor"
                          d="M12 5c-5.05 0-9.27 3.11-11 7.5 1.73 4.39 5.95 7.5 11 7.5s9.27-3.11 11-7.5C21.27 8.11 17.05 5 12 5m0 12a4.5 4.5 0 1 1 4.5-4.5A4.5 4.5 0 0 1 12 17m0-7a2.5 2.5 0 1 0 2.5 2.5A2.5 2.5 0 0 0 12 10"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-500 normal-case sm:text-xs lg:text-xs">
                    At least 6 characters
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase text-neutral-600 sm:text-xs lg:text-xs">
                  <label htmlFor="signup-confirm-password">Confirm Password</label>
                  <div className="relative flex items-center">
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 pr-12 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 sm:h-12 sm:px-5 sm:text-sm lg:h-12 lg:px-5 lg:text-sm"
                      required
                      disabled={loading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      aria-label="Toggle confirm password visibility"
                      aria-pressed={showConfirmPassword}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 transition-colors hover:text-neutral-700 sm:h-8 sm:w-8 lg:h-8 lg:w-8"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                        <path
                          fill="currentColor"
                          d="M12 5c-5.05 0-9.27 3.11-11 7.5 1.73 4.39 5.95 7.5 11 7.5s9.27-3.11 11-7.5C21.27 8.11 17.05 5 12 5m0 12a4.5 4.5 0 1 1 4.5-4.5A4.5 4.5 0 0 1 12 17m0-7a2.5 2.5 0 1 0 2.5 2.5A2.5 2.5 0 0 0 12 10"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 rounded-2xl bg-red-600 text-xs font-bold uppercase text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 sm:h-12 sm:text-sm lg:h-12 lg:text-sm"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="flex items-center gap-4 text-[10px] uppercase text-neutral-400 sm:text-xs lg:text-xs">
                <span className="h-px flex-1 bg-neutral-300" aria-hidden />
                <span>Or</span>
                <span className="h-px flex-1 bg-neutral-300" aria-hidden />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={signInWithGoogle}
                className="flex h-11 items-center justify-center gap-3 rounded-2xl border border-neutral-300 bg-neutral-50 text-xs font-semibold uppercase text-neutral-900 transition-transform duration-150 hover:-translate-y-0.5 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 sm:h-12 sm:text-sm lg:h-12 lg:text-sm"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.18v2.93h5.29a4.54 4.54 0 0 1-1.93 2.98l3.11 2.41a8.36 8.36 0 0 0 2.71-6.44 8.17 8.17 0 0 0-.21-1.88"
                  />
                  <path
                    fill="currentColor"
                    d="M12.17 21c2.45 0 4.51-.81 6.02-2.21l-3.11-2.41a4.7 4.7 0 0 1-6.93-2.48H5.9v2.5A8.44 8.44 0 0 0 12.17 21"
                  />
                  <path
                    fill="currentColor"
                    d="M7 13.9a4.69 4.69 0 0 1 0-3.8v-2.5H4.04a8.5 8.5 0 0 0 0 8.8l2.96-2.5"
                  />
                  <path
                    fill="currentColor"
                    d="M12.17 7.54a4.55 4.55 0 0 1 3.21 1.26l2.42-2.37A8.41 8.41 0 0 0 12.17 3a8.44 8.44 0 0 0-6.27 2.6l2.96 2.49a4.7 4.7 0 0 1 3.31-1.55"
                  />
                </svg>
                Sign up with Google
              </button>

              <p className="text-center text-[10px] uppercase text-neutral-500 sm:text-xs lg:text-xs">
                Already have an account?{" "}
                <Link href="/login" className="text-red-600 transition-colors hover:text-red-700">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
