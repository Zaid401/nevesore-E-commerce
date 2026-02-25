"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (errorParam) {
      setAuthError(errorDescription || errorParam);
      return;
    }

    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) {
            setAuthError(error.message);
          } else {
            router.push("/");
          }
        });
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#cc071e]" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <h1 className="mt-4 text-lg font-extrabold uppercase tracking-[0.2em]">Sign-In Error</h1>
          <p className="mt-2 text-sm text-[#555555]">{authError}</p>
          <a
            href="/login"
            className="mt-4 inline-block rounded-full bg-[#cc071e] px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#e5e5e5] border-t-[#cc071e]" />
        <p className="mt-4 text-sm text-[#555555]">Completing sign in…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e5e5e5] border-t-[#cc071e]" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
