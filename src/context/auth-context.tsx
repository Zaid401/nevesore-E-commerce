"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { auth as firebaseAuth } from "@/lib/firebase";
import { signInWithPhoneNumber } from "firebase/auth";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, fullName?: string, phone?: string) => Promise<{ error: Error | null }>;
  loginWithPhone: (phoneNumber: string, appVerifier: any) => Promise<{ confirmationResult: any; error: Error | null }>;
  verifyPhoneOTP: (confirmationResult: any, otp: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile (auto-creates one for OAuth users if missing)
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url, phone")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
      } else {
        // Profile doesn't exist (e.g. Google OAuth) — create one
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const newProfile = {
            id: user.id,
            email: user.email ?? "",
            full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
            phone: user.user_metadata?.phone ?? null,
          };
          const { data: created, error: insertError } = await supabase
            .from("profiles")
            .upsert(newProfile, { onConflict: "id" })
            .select("id, email, full_name, avatar_url, phone")
            .single();

          if (insertError) throw insertError;
          setProfile(created);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Check firebase auth state
    const unsubscribeFirebase = firebaseAuth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser?.phoneNumber) {
        setUser(firebaseUser as any);
        fetchProfile(firebaseUser.uid); // Will attempt to fetch by UID, may not exist
        setLoading(false);
      }
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        // If supabase logs out, check firebase
        if (!firebaseAuth.currentUser) {
          setUser(null);
          setProfile(null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      unsubscribeFirebase();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return { error: null };
    } catch (error) {
      console.error("Login error:", error);
      return { error: error as Error };
    }
  };

  // Phone Auth via Firebase
  const loginWithPhone = async (phoneNumber: string, appVerifier: any) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(firebaseAuth, phoneNumber, appVerifier);
      return { confirmationResult, error: null };
    } catch (error) {
      console.error("Phone login error:", error);
      return { confirmationResult: null, error: error as Error };
    }
  };

  const verifyPhoneOTP = async (confirmationResult: any, otp: string) => {
    try {
      const result = await confirmationResult.confirm(otp);

      // Look up user by phone number in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', result.user.phoneNumber)
        .maybeSingle();

      if (data) {
        setProfile(data);
      } else {
        // Create basic profile
        const newProfile = {
          id: result.user.uid,
          email: `${result.user.uid}@phone-auth.placeholder.com`,
          phone: result.user.phoneNumber,
        };
        const { data: created } = await supabase
          .from("profiles")
          .upsert(newProfile, { onConflict: "id" })
          .select('*')
          .single();
        if (created) setProfile(created);
      }

      setUser(result.user as any);
      return { error: null };
    } catch (error) {
      console.error("OTP verification error:", error);
      return { error: error as Error };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, fullName?: string, phone?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: error as Error };
    }
  };

  // Reset password via Edge Function (bypasses Supabase SMTP, uses Resend REST API directly)
  const resetPassword = async (email: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-reset-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            redirectTo: `${window.location.origin}/reset-password`,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Failed to send reset email");
      }
      return { error: null };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error: error as Error };
    }
  };

  // Google OAuth
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await firebaseAuth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        loginWithPhone,
        verifyPhoneOTP,
        logout,
        signUp,
        signInWithGoogle,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
