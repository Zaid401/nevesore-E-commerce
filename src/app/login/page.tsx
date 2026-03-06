/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useAuth } from "@/context/auth-context";
import { FcGoogle } from "react-icons/fc";
import { auth as firebaseAuth } from "@/lib/firebase";
// import { RecaptchaVerifier } from "firebase/auth";

// const RECAPTCHA_SITE_KEY = "6LfLfoAsAAAAABNKFMQWlpb3zRbGV5Wg89ideXqX";

// async function getRecaptchaToken(action: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     window.grecaptcha.enterprise.ready(async () => {
//       try {
//         const token = await window.grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, { action });
//         resolve(token);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   });
// }

// async function verifyRecaptchaToken(token: string, action: string): Promise<void> {
//   const res = await fetch(
//     "https://cqeosjuwkaxcnigqtymw.supabase.co/functions/v1/verify-recaptcha",
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token, action }),
//     }
//   );
//   const data = await res.json();
//   if (!data.success) {
//     throw new Error(data.message || "reCAPTCHA verification failed.");
//   }
// }

export default function LoginPage() {
  const router = useRouter();
  const { login, signInWithGoogle, loginWithPhone, verifyPhoneOTP, resetPassword } = useAuth();
  const [loginMethod, setLoginMethod] = useState<"standard" | "phone" | "forgot">("standard");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // try {
    //   const token = await getRecaptchaToken("LOGIN");
    //   await verifyRecaptchaToken(token, "LOGIN");
    // } catch (err: any) {
    //   setError(err.message || "reCAPTCHA check failed. Please try again.");
    //   setLoading(false);
    //   return;
    // }

    const { error: loginError } = await login(email, password);

    if (loginError) {
      setError(loginError.message || "Failed to login. Please check your credentials.");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // reCAPTCHA Enterprise check (disabled)
      // const token = await getRecaptchaToken("PHONE_LOGIN");
      // await verifyRecaptchaToken(token, "PHONE_LOGIN");

      let formattedPhone = phoneNumber.trim();
      // Ensure E.164 format: Must start with a '+' and contain country code.
      // Default to +91 (India) if exactly 10 digits are entered.
      if (!formattedPhone.startsWith("+")) {
        const digitsOnly = formattedPhone.replace(/\D/g, "");
        formattedPhone = digitsOnly.length === 10 ? `+91${digitsOnly}` : `+${digitsOnly}`;
      }

      // Firebase phone auth still requires its own RecaptchaVerifier internally (disabled).
      // if (!(window as any).recaptchaVerifier) {
      //   (window as any).recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", {
      //     size: "invisible",
      //   });
      // }
      const { confirmationResult: confResult, error: phoneError } = await loginWithPhone(formattedPhone, (window as any).recaptchaVerifier);
      if (phoneError) throw phoneError;
      setConfirmationResult(confResult);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: verifyError } = await verifyPhoneOTP(confirmationResult, otp);
    if (verifyError) {
      setError(verifyError.message || "Invalid OTP.");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: resetError } = await resetPassword(forgotEmail);
    setLoading(false);
    if (resetError) {
      setError(resetError.message || "Failed to send reset email. Please try again.");
    } else {
      setForgotSuccess(true);
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
                  Access Your Potential
                </h1>
                <p className="text-xs text-neutral-600 sm:text-sm lg:text-sm">
                  Enter your credentials to continue your training.
                </p>
              </header>

              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600 sm:text-sm lg:text-sm">
                  {error}
                </div>
              )}

              {loginMethod === "standard" ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6 lg:gap-6">
                  <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase text-neutral-600 sm:text-xs lg:text-xs">
                    <label htmlFor="login-email">Email Address</label>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="enter your email address"
                      className="h-11 rounded-2xl border border-neutral-300 bg-neutral-50 px-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 sm:h-12 sm:px-5 sm:text-sm lg:h-12 lg:px-5 lg:text-sm"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase text-neutral-600 sm:text-xs lg:text-xs">
                    <div className="flex items-center justify-between">
                      <label htmlFor="login-password">Password</label>
                      <button
                        type="button"
                        onClick={() => { setLoginMethod("forgot"); setError(""); setForgotSuccess(false); }}
                        className="text-[10px] font-bold text-red-600 transition-colors hover:text-red-700"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 pr-12 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 sm:h-12 sm:px-5 sm:text-sm lg:h-12 lg:px-5 lg:text-sm"
                        required
                        disabled={loading}
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
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 rounded-2xl bg-red-600 text-xs font-bold uppercase text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 sm:h-12 sm:text-sm lg:h-12 lg:text-sm"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </form>
              ) : loginMethod === "forgot" ? (
                <div className="flex flex-col gap-5 sm:gap-6 lg:gap-6">
                  {forgotSuccess ? (
                    <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-4 text-xs text-green-700 sm:text-sm">
                      <p className="font-bold uppercase">Check your inbox</p>
                      <p className="mt-1">A password reset link has been sent to <span className="font-semibold">{forgotEmail}</span>. Follow the link to set a new password.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="flex flex-col gap-5 sm:gap-6 lg:gap-6">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-neutral-600 sm:text-sm">Enter the email address associated with your account and we&apos;ll send you a reset link.</p>
                      </div>
                      <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase text-neutral-600 sm:text-xs lg:text-xs">
                        <label htmlFor="forgot-email">Email Address</label>
                        <input
                          id="forgot-email"
                          type="email"
                          autoComplete="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="enter your email address"
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
                        {loading ? "Sending..." : "Send Reset Link"}
                      </button>
                    </form>
                  )}
                  <button
                    type="button"
                    onClick={() => { setLoginMethod("standard"); setError(""); setForgotSuccess(false); }}
                    className="text-[10px] uppercase text-neutral-500 hover:text-neutral-900 sm:text-xs lg:text-xs"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={otpSent ? handleVerifyOTP : handlePhoneLogin} className="flex flex-col gap-5 sm:gap-6 lg:gap-6">
                  {!otpSent ? (
                    <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase text-neutral-600 sm:text-xs lg:text-xs">
                      <label htmlFor="login-phone">Phone Number</label>
                      <input
                        id="login-phone"
                        type="tel"
                        autoComplete="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 234 567 8900"
                        className="h-11 rounded-2xl border border-neutral-300 bg-neutral-50 px-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 sm:h-12 sm:px-5 sm:text-sm lg:h-12 lg:px-5 lg:text-sm"
                        required
                        disabled={loading}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 text-[10px] font-semibold uppercase text-neutral-600 sm:text-xs lg:text-xs">
                      <label htmlFor="login-otp">Enter OTP</label>
                      <input
                        id="login-otp"
                        type="text"
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="h-11 rounded-2xl border border-neutral-300 bg-neutral-50 px-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 sm:h-12 sm:px-5 sm:text-sm lg:h-12 lg:px-5 lg:text-sm"
                        required
                        disabled={loading}
                      />
                    </div>
                  )}

                  {/* <div id="recaptcha-container"></div> */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 rounded-2xl bg-red-600 text-xs font-bold uppercase text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 sm:h-12 sm:text-sm lg:h-12 lg:text-sm"
                  >
                    {loading ? (otpSent ? "Verifying..." : "Sending OTP...") : (otpSent ? "Verify OTP" : "Send OTP")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod("standard")}
                    className="text-[10px] uppercase text-neutral-500 hover:text-neutral-900 sm:text-xs lg:text-xs"
                  >
                    Back to Email Login
                  </button>
                </form>
              )}

              {loginMethod !== "forgot" && (
                <div className="flex items-center gap-4 text-[10px] uppercase text-neutral-400 sm:text-xs lg:text-xs">
                  <span className="h-px flex-1 bg-neutral-300" aria-hidden />
                  <span>Or</span>
                  <span className="h-px flex-1 bg-neutral-300" aria-hidden />
                </div>
              )}

              {/* {loginMethod === "standard" && (
                <button
                  type="button"
                  onClick={() => setLoginMethod("phone")}
                  className="flex h-11 items-center justify-center gap-3 rounded-2xl border border-neutral-300 bg-neutral-50 text-xs font-semibold uppercase text-neutral-900 transition-transform duration-150 hover:-translate-y-0.5 hover:border-neutral-400 sm:h-12 sm:text-sm lg:h-12 lg:text-sm"
                >
                  Continue with Phone
                </button>
              )} */}

              {loginMethod !== "forgot" && (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="flex h-11 items-center justify-center gap-3 rounded-2xl border border-neutral-300 bg-neutral-50 text-xs font-semibold uppercase text-neutral-900 transition-transform duration-150 hover:-translate-y-0.5 hover:border-neutral-400 sm:h-12 sm:text-sm lg:h-12 lg:text-sm"
                >
                  <FcGoogle className="h-5 w-5" />
                  Continue with Google
                </button>
              )}

              <p className="text-center text-[10px] uppercase text-neutral-500 sm:text-xs lg:text-xs">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-red-600 transition-colors hover:text-red-700">
                  Create Account
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
