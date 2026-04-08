"use client";

import { useState, useCallback } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { FaSpinner } from "react-icons/fa";
import { BsCloudLightningFill } from "react-icons/bs";
import Link from "next/link";
// ─── Error helper ────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";
  const e = error as { errors?: { longMessage?: string }[]; message?: string };
  return (
    e.errors?.[0]?.longMessage ??
    e.message ??
    "An unexpected error occurred. Please try again."
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AuthPage() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // ── Sign In ───────────────────────────────────────────────────────────────

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

      if (signIn.status === "complete") {
        const { error: fErr } = await signIn.finalize();
        if (fErr) {
          setAuthError(getErrorMessage(fErr));
          setLoading(false);
          return;
        }
        window.location.href = "/dashboard";
      } else {
        setAuthError("Additional verification is required.");
        setLoading(false);
      }
    } catch (err) {
      setAuthError(getErrorMessage(err));
      setLoading(false);
    }
  }, [signIn, email, password]);

  // ── Sign Up ───────────────────────────────────────────────────────────────

  const handleSignUp = useCallback(async () => {
    if (!signUp) return;
    setLoading(true);
    setAuthError(null);

    try {
      const { error: createErr } = await signUp.password({
        emailAddress: email,
        password,
        username: username || undefined,
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
  }, [signUp, email, password, firstName, lastName, username]);

  // ── Verify ────────────────────────────────────────────────────────────────

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

      if (signUp.status === "complete" || signUp.createdSessionId) {
        const { error: fErr } = await signUp.finalize();
        if (fErr) {
          setAuthError(getErrorMessage(fErr));
          setLoading(false);
          return;
        }
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
  }, [signUp, verificationCode]);

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(() => {
    if (pendingVerification) return handleVerify();
    if (isSignUp) return handleSignUp();
    return handleSignIn();
  }, [pendingVerification, isSignUp, handleVerify, handleSignUp, handleSignIn]);

  // ── Toggle mode ───────────────────────────────────────────────────────────

  const toggleMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
    setAuthError(null);
    setPendingVerification(false);
    setVerificationCode("");
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const heading = pendingVerification
    ? "Verify your email"
    : isSignUp
      ? "Create your account"
      : "Welcome back";

  const subtext = pendingVerification
    ? `We sent a 6-digit code to ${email}`
    : isSignUp
      ? "Fill in your details to get started"
      : "Sign in to your account";

  const canSubmit = pendingVerification
    ? verificationCode.length === 6
    : isSignUp
      ? !!(email && password && username)
      : !!(email && password);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black text-zinc-100">
      <div className="w-full max-w-md bg-black   p-8 space-y-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center space-y-3 text-center relative z-10">
          <div className="p-3 bg-zinc-800 rounded-full border border-gray-700 ">
            <BsCloudLightningFill className="text-4xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{heading}</h1>
          <p className="text-lg font-semibold text-zinc-100">{subtext}</p>
        </div>

        {/* Error */}
        {authError && (
          <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl text-center relative z-10">
            {authError}
          </div>
        )}

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <div className="space-y-4 relative z-10">
          {!pendingVerification ? (
            <>
              {/* Sign-up only fields */}
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3  bg-black border-b-2 border-zinc-200 text-white placeholder:text-zinc-500 focus:outline-none  transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3  bg-black border-b-2 border-zinc-200 text-white placeholder:text-zinc-500 focus:outline-none  transition-all"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_-]/g, ""),
                      )
                    }
                    autoComplete="username"
                    className="w-full px-4 py-3  bg-black border-b-2 border-zinc-200 text-white placeholder:text-zinc-500 focus:outline-none  transition-all"
                  />
                </>
              )}

              {/* Shared fields */}
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full px-4 py-3  bg-black border-b-2 border-zinc-200 text-white placeholder:text-zinc-500 focus:outline-none  transition-all"
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
                className="w-full px-4 py-3  bg-black border-b-2 border-zinc-200 text-white placeholder:text-zinc-500 focus:outline-none  transition-all"
              />

              {/* Clerk CAPTCHA widget – sign-up only */}
              {isSignUp && (
                <div
                  id="clerk-captcha"
                  data-cl-theme="dark"
                  data-cl-size="flexible"
                />
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !canSubmit}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full font-semibold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : isSignUp ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Toggle */}
              <button
                onClick={toggleMode}
                className="w-full text-center text-sm text-zinc-100 cursor-pointer font-semibold hover:text-blue-400 transition-colors"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don\u2019t have an account? Sign up"}
              </button>
            </>
          ) : (
            /* ── Verification ──────────────────────────────────────────────── */
            <>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && canSubmit && handleSubmit()
                }
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-center text-lg tracking-[0.3em] placeholder:text-zinc-500 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />

              <button
                onClick={handleSubmit}
                disabled={loading || !canSubmit}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
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
                className="w-full text-center text-sm text-zinc-400 hover:text-blue-400 transition-colors"
              >
                Go back and edit details
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-600">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="underline text-gray-100 hover:text-gray-200"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline text-gray-100 hover:text-gray-200"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
