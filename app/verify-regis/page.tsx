"use client";

import { useState, useCallback, useMemo } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaMicrosoft, FaApple, FaSpinner } from "react-icons/fa";
import { BsCloudLightningFill } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { IoArrowBack } from "react-icons/io5";

// ─── Types ───────────────────────────────────────────────────────────────────

type OAuthStrategy =
  | "oauth_google"
  | "oauth_github"
  | "oauth_microsoft"
  | "oauth_apple";

type Mode = "select" | "email-signin" | "email-signup";

// ─── Constants ───────────────────────────────────────────────────────────────

const PROVIDERS = [
  {
    id: "oauth_google" as OAuthStrategy,
    label: "Google",
    icon: <FcGoogle className="text-xl" />,
    style: "bg-white text-zinc-900 hover:bg-zinc-100",
  },
  {
    id: "oauth_github" as OAuthStrategy,
    label: "GitHub",
    icon: <FaGithub className="text-xl" />,
    style: "bg-[#24292f] text-white hover:bg-[#32383f]",
  },
  {
    id: "oauth_microsoft" as OAuthStrategy,
    label: "Microsoft",
    icon: <FaMicrosoft className="text-xl text-[#00a4ef]" />,
    style: "bg-zinc-950 text-white border border-zinc-800 hover:bg-zinc-800",
  },
  {
    id: "oauth_apple" as OAuthStrategy,
    label: "Apple",
    icon: <FaApple className="text-xl" />,
    style: "bg-black text-white border border-zinc-800 hover:bg-zinc-900",
  },
] as const;

// ─── Error helper ────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";
  // ClerkError shape: { errors: [{ longMessage }] } or { message }
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

  const [mode, setMode] = useState<Mode>("select");
  const [oauthLoading, setOauthLoading] = useState<OAuthStrategy | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const isSignUp = mode === "email-signup";

  // ── OAuth ─────────────────────────────────────────────────────────────────

  const handleOAuth = useCallback(
    async (strategy: OAuthStrategy) => {
      if (!signIn) return;
      setOauthLoading(strategy);
      setAuthError(null);

      try {
        const { error } = await signIn.sso({
          strategy,
          redirectCallbackUrl: "/sso-callback",
          redirectUrl: "/dashboard",
        });
        if (error) {
          setAuthError(getErrorMessage(error));
          setOauthLoading(null);
        }
        // If no error, the browser is redirecting to the OAuth provider
      } catch (err) {
        console.error("OAuth error:", err);
        setAuthError(getErrorMessage(err));
        setOauthLoading(null);
      }
    },
    [signIn],
  );

  // ── Email sign-in (Future API: signIn.password + signIn.finalize) ─────────

  const handleEmailSignIn = useCallback(async () => {
    if (!signIn) return;
    setEmailLoading(true);
    setAuthError(null);

    try {
      const { error } = await signIn.password({
        identifier: email,
        password,
      });

      if (error) {
        setAuthError(getErrorMessage(error));
        setEmailLoading(false);
        return;
      }

      if (signIn.status === "complete") {
        const { error: fErr } = await signIn.finalize();
        if (fErr) {
          setAuthError(getErrorMessage(fErr));
          setEmailLoading(false);
          return;
        }
        window.location.href = "/dashboard";
      } else {
        // needs_second_factor, needs_new_password, etc.
        console.log("Sign-in requires additional step:", signIn.status);
        setAuthError("Additional verification is required.");
        setEmailLoading(false);
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setAuthError(getErrorMessage(err));
      setEmailLoading(false);
    }
  }, [signIn, email, password]);

  // ── Email sign-up (Future API: signUp.password + verifications) ───────────

  const handleEmailSignUp = useCallback(async () => {
    if (!signUp) return;
    setEmailLoading(true);
    setAuthError(null);

    try {
      // 1. Create sign-up with password strategy
      const { error: createErr } = await signUp.password({
        emailAddress: email,
        password,
        username: username || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });

      if (createErr) {
        setAuthError(getErrorMessage(createErr));
        setEmailLoading(false);
        return;
      }

      // Debug: check state after password()
      console.log("After password() → status:", signUp.status);
      console.log("After password() → missingFields:", signUp.missingFields);
      console.log(
        "After password() → unverifiedFields:",
        signUp.unverifiedFields,
      );

      // 2. Send email verification code
      const { error: sendErr } = await signUp.verifications.sendEmailCode();

      if (sendErr) {
        setAuthError(getErrorMessage(sendErr));
        setEmailLoading(false);
        return;
      }

      setPendingVerification(true);
    } catch (err) {
      console.error("Sign-up error:", err);
      setAuthError(getErrorMessage(err));
    } finally {
      setEmailLoading(false);
    }
  }, [signUp, email, password, firstName, lastName, username]);

  // ── Verify email code (Future API: signUp.verifications.verifyEmailCode) ──

  const handleVerify = useCallback(async () => {
    if (!signUp) return;
    setEmailLoading(true);
    setAuthError(null);

    try {
      const { error: verifyErr } = await signUp.verifications.verifyEmailCode({
        code: verificationCode,
      });

      if (verifyErr) {
        setAuthError(getErrorMessage(verifyErr));
        setEmailLoading(false);
        return;
      }

      // Debug: log what Clerk still wants
      console.log("Sign-up status:", signUp.status);
      console.log("Missing fields:", signUp.missingFields);
      console.log("Unverified fields:", signUp.unverifiedFields);
      console.log("Created session ID:", signUp.createdSessionId);

      if (signUp.status === "complete" || signUp.createdSessionId) {
        const { error: fErr } = await signUp.finalize();
        if (fErr) {
          setAuthError(getErrorMessage(fErr));
          setEmailLoading(false);
          return;
        }
        window.location.href = "/dashboard";
      } else {
        // Surface exactly what Clerk still requires
        const missing = signUp.missingFields ?? [];
        const unverified = signUp.unverifiedFields ?? [];
        console.error("Still missing:", missing, "| Unverified:", unverified);
        setAuthError(
          missing.length > 0
            ? `Missing required fields: ${missing.join(", ")}`
            : unverified.length > 0
              ? `Still unverified: ${unverified.join(", ")}`
              : "Sign-up incomplete. Please try again.",
        );
        setEmailLoading(false);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setAuthError(getErrorMessage(err));
      setEmailLoading(false);
    }
  }, [signUp, verificationCode]);

  // ── Submit dispatcher ─────────────────────────────────────────────────────

  const handleSubmit = useCallback(() => {
    if (pendingVerification) {
      handleVerify();
    } else if (isSignUp) {
      handleEmailSignUp();
    } else {
      handleEmailSignIn();
    }
  }, [
    pendingVerification,
    isSignUp,
    handleVerify,
    handleEmailSignUp,
    handleEmailSignIn,
  ]);

  // ── Reset ─────────────────────────────────────────────────────────────────

  const goBack = useCallback(() => {
    setMode("select");
    setAuthError(null);
    setPendingVerification(false);
    setVerificationCode("");
  }, []);

  // ── Headings ──────────────────────────────────────────────────────────────

  const heading = useMemo(() => {
    if (pendingVerification) return "Verify your email";
    if (isSignUp) return "Create your account";
    if (mode === "email-signin") return "Sign in with email";
    return "Welcome to AuraCloud";
  }, [mode, isSignUp, pendingVerification]);

  const subtext = useMemo(() => {
    if (pendingVerification) return `We sent a code to ${email}`;
    if (isSignUp) return "Fill in your details to get started";
    if (mode === "email-signin") return "Enter your credentials";
    return "Sign in or create an account to continue";
  }, [mode, isSignUp, pendingVerification, email]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl p-8 space-y-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

        {/* Back button */}
        {mode !== "select" && (
          <button
            onClick={goBack}
            className="relative z-10 flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <IoArrowBack /> Back
          </button>
        )}

        {/* Header */}
        <div className="flex flex-col items-center space-y-3 text-center relative z-10">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <BsCloudLightningFill className="text-4xl text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">{heading}</h1>
          <p className="text-sm text-zinc-400">{subtext}</p>
        </div>

        {/* Error */}
        {authError && (
          <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl text-center relative z-10">
            {authError}
          </div>
        )}

        {/* ── Provider Select ──────────────────────────────────────────────── */}
        {mode === "select" && (
          <div className="space-y-3 relative z-10">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleOAuth(p.id)}
                disabled={oauthLoading !== null || !signIn}
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${p.style}`}
              >
                {oauthLoading === p.id ? (
                  <FaSpinner className="animate-spin text-lg" />
                ) : (
                  p.icon
                )}
                Continue with {p.label}
              </button>
            ))}

            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <button
              onClick={() => setMode("email-signin")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium bg-zinc-800 text-white hover:bg-zinc-700 transition-all shadow-sm"
            >
              <HiOutlineMail className="text-xl" />
              Sign in with Email
            </button>

            <button
              onClick={() => setMode("email-signup")}
              className="w-full text-center text-sm text-zinc-400 hover:text-blue-400 transition-colors py-1"
            >
              Don&apos;t have an account?{" "}
              <span className="font-semibold underline underline-offset-2">
                Sign up
              </span>
            </button>
          </div>
        )}

        {/* ── Email Form ───────────────────────────────────────────────────── */}
        {(mode === "email-signin" || mode === "email-signup") && (
          <div className="space-y-4 relative z-10">
            {!pendingVerification ? (
              <>
                {isSignUp && (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                )}

                {isSignUp && (
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
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                )}

                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />

                {/* Clerk CAPTCHA widget – required for bot protection on sign-up */}
                {isSignUp && (
                  <div
                    id="clerk-captcha"
                    data-cl-theme="dark"
                    data-cl-size="flexible"
                  />
                )}

                <button
                  onClick={handleSubmit}
                  disabled={
                    emailLoading ||
                    !email ||
                    !password ||
                    (isSignUp && !username)
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                >
                  {emailLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </button>

                <button
                  onClick={() =>
                    setMode(isSignUp ? "email-signin" : "email-signup")
                  }
                  className="w-full text-center text-sm text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don\u2019t have an account? Sign up"}
                </button>
              </>
            ) : (
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
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-center text-lg tracking-[0.3em] placeholder:text-zinc-500 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />

                <button
                  onClick={handleSubmit}
                  disabled={emailLoading || verificationCode.length < 6}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                >
                  {emailLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Verify & Continue"
                  )}
                </button>
              </>
            )}
          </div>
        )}

        <p className="text-center text-xs text-zinc-600 relative z-10">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
