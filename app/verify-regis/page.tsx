"use client";

import { useState, useCallback } from "react";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { FaSpinner } from "react-icons/fa";
import { BsCloudRain } from "react-icons/bs";
import Link from "next/link";

function getErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";
  const e = error as { errors?: { longMessage?: string }[]; message?: string };
  return (
    e.errors?.[0]?.longMessage ??
    e.message ??
    "An unexpected error occurred. Please try again."
  );
}

export default function AuthPage() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { setActive } = useClerk();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSignIn = useCallback(async () => {
    if (!signIn) return;
    setLoading(true);
    setAuthError(null);
    try {
      const { error } = await signIn.password({ identifier: email, password });
      if (error) {
        setAuthError(getErrorMessage(error));
        setLoading(false);
        return;
      }
      if (signIn.status === "complete" && signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId });
        window.location.href = "/dashboard";
      } else {
        // Updated debugging message to show exact Clerk status
        setAuthError(`Status: ${signIn.status} — requires additional steps.`);
        setLoading(false);
      }
    } catch (err) {
      setAuthError(getErrorMessage(err));
      setLoading(false);
    }
  }, [signIn, setActive, email, password]);

  const handleSignUp = useCallback(async () => {
    if (!signUp) return;
    setLoading(true);
    setAuthError(null);
    try {
      const { error: createErr } = await signUp.password({
        emailAddress: email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
      if (createErr) {
        setAuthError(getErrorMessage(createErr));
        setLoading(false);
        return;
      }
      const { error: sendErr } = await signUp.verifications.sendEmailCode();
      if (sendErr) {
        setAuthError(getErrorMessage(sendErr));
        setLoading(false);
        return;
      }
      setPendingVerification(true);
    } catch (err) {
      setAuthError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [signUp, email, password, firstName, lastName]);

  const handleVerify = useCallback(async () => {
    if (!signUp) return;
    setLoading(true);
    setAuthError(null);
    try {
      const { error: verifyErr } = await signUp.verifications.verifyEmailCode({
        code: verificationCode,
      });
      if (verifyErr) {
        setAuthError(getErrorMessage(verifyErr));
        setLoading(false);
        return;
      }
      if (
        (signUp.status === "complete" || signUp.createdSessionId) &&
        signUp.createdSessionId
      ) {
        await setActive({ session: signUp.createdSessionId });
        window.location.href = "/dashboard";
      } else {
        const missing = signUp.missingFields ?? [];
        const unverified = signUp.unverifiedFields ?? [];
        setAuthError(
          missing.length > 0
            ? `Missing required fields: ${missing.join(", ")}`
            : unverified.length > 0
              ? `Still unverified: ${unverified.join(", ")}`
              : "Sign-up incomplete. Please try again.",
        );
        setLoading(false);
      }
    } catch (err) {
      setAuthError(getErrorMessage(err));
      setLoading(false);
    }
  }, [signUp, setActive, verificationCode]);

  const handleSubmit = useCallback(() => {
    if (pendingVerification) return handleVerify();
    if (isSignUp) return handleSignUp();
    return handleSignIn();
  }, [pendingVerification, isSignUp, handleVerify, handleSignUp, handleSignIn]);

  const toggleMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
    setAuthError(null);
    setPendingVerification(false);
    setVerificationCode("");
  }, []);

  const heading = pendingVerification
    ? "Verify your email"
    : isSignUp
      ? "Sign up for an account"
      : "Login to your account";

  const subtext = pendingVerification
    ? `We sent a 6-digit code to ${email}`
    : isSignUp
      ? "Fill in your details to get started"
      : "Sign in to your account";

  const canSubmit = pendingVerification
    ? verificationCode.length === 6
    : isSignUp
      ? !!(email && password && firstName && lastName)
      : !!(email && password);

  const inputClass =
    "w-full px-4 py-2 bg-[#181818] rounded-xl border border-[#444444] text-[17px] text-white placeholder:text-neutral-500 focus:outline-none  transition-all duration-500 ";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1e1e1e] text-neutral-200">
      <div className="w-full max-w-sm p-2 space-y-8 relative">
        {/* Subtle glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center space-y-4 text-center relative z-10">
          <div className="p-3.5">
            <BsCloudRain size={65} className="text-5xl text-[#ff9100]" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-[28px] special-font font-bold text-white">
              <span className="text-white">Welcome to </span> Kosha
            </h1>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-[22px] font-semibold text-white tracking-tight">
              {heading}
            </h1>
            <p className="text-[14px] text-neutral-500">{subtext}</p>
          </div>
        </div>

        {/* Error */}
        {authError && (
          <div className="p-3 text-[13px] text-red-400 bg-red-500/[0.06] border border-red-500/[0.1] rounded-xl text-center relative z-10 animate-[fadeIn_0.3s_ease-out]">
            {authError}
          </div>
        )}

        {/* Form */}
        <div className="space-y-1 relative z-10">
          {!pendingVerification ? (
            <>
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={inputClass}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                onKeyDown={(e) =>
                  e.key === "Enter" && canSubmit && handleSubmit()
                }
                className={inputClass}
              />

              {/* CAPTCHA is now rendered for BOTH Sign Up and Sign In */}
              <div
                id="clerk-captcha"
                data-cl-theme="dark"
                data-cl-size="flexible"
                className="pt-3"
              />

              <div className="pt-6 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !canSubmit}
                  className="w-full flex items-center justify-center  gap-2 py-3 px-4 rounded-xl font-medium text-[17px] bg-blue-800 text-white cursor-pointer hover:bg-blue-700  transition-all duration-200 "
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Log In"
                  )}
                </button>

                <button
                  onClick={toggleMode}
                  className="w-full text-center text-[13px] text-neutral-500 cursor-pointer font-medium hover:text-white transition-colors duration-300 py-1"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don\u2019t have an account? Sign up"}
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && canSubmit && handleSubmit()
                }
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-center text-xl tracking-[0.4em] placeholder:text-neutral-700 placeholder:tracking-[0.4em] focus:outline-none focus:border-white/[0.2] transition-all duration-500"
              />

              <div className="pt-5 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !canSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-[14px] bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.97]"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Verify & Continue"
                  )}
                </button>

                <button
                  onClick={() => {
                    setPendingVerification(false);
                    setVerificationCode("");
                    setAuthError(null);
                  }}
                  className="w-full text-center text-[13px] text-neutral-500 hover:text-white transition-colors duration-300 py-1"
                >
                  Go back
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-neutral-600 relative z-10 pt-2">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
