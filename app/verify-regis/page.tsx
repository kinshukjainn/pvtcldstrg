"use client";

import { useState, useCallback, useEffect } from "react";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";

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

  const [pendingMfa, setPendingMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState("");

  const providers = ["AWS", "Clerk"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Cycle through the providers every 2.5 seconds
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % providers.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [providers.length]);

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
      }
      // Catch both "needs_second_factor" and "needs_client_trust"
      else if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_client_trust"
      ) {
        const emailFactor = signIn.supportedSecondFactors?.find(
          (f) => f.strategy === "email_code",
        );

        if (emailFactor) {
          // Uses the new SignInFutureResource method instead of prepareSecondFactor
          const { error: sendError } = await signIn.emailCode.sendCode();
          if (sendError) {
            setAuthError(getErrorMessage(sendError));
            setLoading(false);
            return;
          }

          setPendingMfa(true);
          setLoading(false);
        } else {
          setAuthError(
            "Device verification required, but no email factor was found.",
          );
          setLoading(false);
        }
      } else {
        setAuthError(`Status: ${signIn.status} — requires additional steps.`);
        setLoading(false);
      }
    } catch (err) {
      setAuthError(getErrorMessage(err));
      setLoading(false);
    }
  }, [signIn, setActive, email, password]);

  const handleVerifyMfa = useCallback(async () => {
    if (!signIn) return;
    setLoading(true);
    setAuthError(null);
    try {
      // Uses the new SignInFutureResource method instead of attemptSecondFactor
      const { error } = await signIn.emailCode.verifyCode({ code: mfaCode });

      if (error) {
        setAuthError(getErrorMessage(error));
        setLoading(false);
        return;
      }

      if (signIn.status === "complete" && signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId });
        window.location.href = "/dashboard";
      } else {
        setAuthError(`Verification incomplete. Status: ${signIn.status}`);
        setLoading(false);
      }
    } catch (err) {
      setAuthError(getErrorMessage(err));
      setLoading(false);
    }
  }, [signIn, setActive, mfaCode]);

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

  const handleVerifySignUp = useCallback(async () => {
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
    if (pendingMfa) return handleVerifyMfa();
    if (pendingVerification) return handleVerifySignUp();
    if (isSignUp) return handleSignUp();
    return handleSignIn();
  }, [
    pendingMfa,
    pendingVerification,
    isSignUp,
    handleVerifyMfa,
    handleVerifySignUp,
    handleSignUp,
    handleSignIn,
  ]);

  const toggleMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
    setAuthError(null);
    setPendingVerification(false);
    setPendingMfa(false);
    setVerificationCode("");
    setMfaCode("");
  }, []);

  const heading = pendingMfa
    ? "Device Verification"
    : pendingVerification
      ? "Verify Email"
      : isSignUp
        ? "Create Account"
        : "System Login";

  const subtext = pendingMfa
    ? "A security code has been sent to your email."
    : pendingVerification
      ? `A 6-digit code has been sent to ${email}.`
      : isSignUp
        ? "Provide credentials to register a new user."
        : "Enter your credentials to access the system.";

  const canSubmit = pendingMfa
    ? mfaCode.length === 6
    : pendingVerification
      ? verificationCode.length === 6
      : isSignUp
        ? !!(email && password && firstName && lastName)
        : !!(email && password);

  // Azure Standard Input Classes
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] rounded-sm transition-all";

  // Azure Standard Label Classes
  const labelClass = "block text-[13px] font-semibold text-gray-700 mb-1.5";

  // Azure Flat Button Effects
  const primaryButtonClass =
    "w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-[14px] bg-[#0078D4] hover:bg-[#005a9e] text-white rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const secondaryButtonClass =
    "w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-[14px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-sm transition-colors disabled:opacity-50";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf9f8] text-gray-900 font-sans selection:bg-[#cce3f5]">
      <div className="w-full max-w-[440px] bg-white border border-gray-200 p-8 shadow-sm rounded-sm">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-4">
            <Image
              src="/authlogo.png"
              alt="Kosha Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1 leading-tight">
            Kosha Authentication
          </h1>
          <h2 className="text-lg text-gray-800 mt-2">{heading}</h2>
          <p className="text-[13px] text-gray-500 mt-1">{subtext}</p>
        </div>

        {/* Security Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1.5 text-[12px] text-gray-500 bg-gray-50 px-3 py-1 rounded-sm border border-gray-100">
            <LockKeyhole className="w-3.5 h-3.5" />
            <span>Secured by</span>
            <div className="relative flex items-center justify-start w-[40px] h-[16px] overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={providers[index]}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#0078D4] font-medium absolute left-0"
                >
                  {providers[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {authError && (
          <div className="mb-5 p-3 bg-[#fdf3f4] border border-[#f4c8ca] text-[#a4262c] text-[13px] font-medium rounded-sm">
            {authError}
          </div>
        )}

        {/* Main Form */}
        <div className="space-y-5">
          {pendingMfa || pendingVerification ? (
            <>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Security Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={pendingMfa ? mfaCode : verificationCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    if (pendingMfa) setMfaCode(val);
                    else setVerificationCode(val);
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && canSubmit && handleSubmit()
                  }
                  className={`${inputClass} text-center text-xl tracking-[0.2em] py-3`}
                />
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !canSubmit}
                  className={primaryButtonClass}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Verify & Continue"
                  )}
                </button>

                <button
                  onClick={() => {
                    setPendingMfa(false);
                    setPendingVerification(false);
                    setVerificationCode("");
                    setMfaCode("");
                    setAuthError(null);
                  }}
                  className="w-full text-center text-[13px] text-[#0078D4] hover:text-[#005a9e] hover:underline py-1 cursor-pointer transition-colors"
                >
                  Cancel and go back
                </button>
              </div>
            </>
          ) : (
            <>
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  onKeyDown={(e) =>
                    e.key === "Enter" && canSubmit && handleSubmit()
                  }
                  className={inputClass}
                />
              </div>

              {/* CLERK CAPTCHA - Theme switched to light to match Azure */}
              <div
                id="clerk-captcha"
                data-cl-theme="light"
                data-cl-size="flexible"
                className="pt-1"
              />

              <div className="pt-4 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !canSubmit}
                  className={primaryButtonClass}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </button>

                <div className="relative py-2 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative bg-white px-2 text-[12px] text-gray-500 bg-white">
                    or
                  </div>
                </div>

                <button onClick={toggleMode} className={secondaryButtonClass}>
                  {isSignUp ? "Switch to Sign In" : "Create New Account"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-[12px] text-gray-500 leading-relaxed">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-[#0078D4] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#0078D4] hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
