"use client";

import { useState, useCallback, useEffect } from "react";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import { BsCloudRain } from "react-icons/bs";
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

  // Flat, sharp, high-contrast input styling
  const inputClass =
    "w-full px-3 py-2 bg-[#000000] border-2 border-[#555555] text-[15px] text-white placeholder:text-[#777777] focus:outline-none focus:border-[#aaaaaa] rounded-none";

  // Classic raised 3D button effect
  const primaryButtonClass =
    "w-full flex items-center justify-center gap-2 py-2 px-4 font-bold text-[15px] bg-[#0055cc] text-white border-2 border-t-[#3388ff] border-l-[#3388ff] border-r-[#002266] border-b-[#002266] active:border-t-[#002266] active:border-l-[#002266] active:border-b-[#3388ff] active:border-r-[#3388ff] hover:bg-[#0066ee] disabled:opacity-50 disabled:cursor-not-allowed rounded-none";

  const secondaryButtonClass =
    "w-full flex items-center justify-center gap-2 py-2 px-4 font-bold text-[15px] bg-[#dddddd] text-black border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#888888] border-b-[#888888] active:border-t-[#888888] active:border-l-[#888888] active:border-b-[#ffffff] active:border-r-[#ffffff] hover:bg-[#ffffff] rounded-none";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#111111] text-[#dddddd] font-sans selection:bg-[#0055cc] selection:text-white">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-[#444444] p-6 shadow-[6px_6px_0px_#000000]">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-4 bg-[#000000] border border-[#444444] p-3">
            <BsCloudRain size={40} className="text-[#dd7700]" />
          </div>
          <h1 className="text-[22px] font-bold text-white mb-1 uppercase tracking-tight">
            Kosha Authentication
          </h1>

          <div className="border-t border-[#444444] w-full my-3"></div>

          <h2 className="text-[18px] font-bold text-white uppercase tracking-tight">
            {heading}
          </h2>
          <p className="text-[13px] text-[#aaaaaa] mt-1 font-bold">{subtext}</p>
        </div>

        {/* Security Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#111111] border border-[#444444] text-[12px] font-bold text-[#aaaaaa] uppercase tracking-wide">
            <LockKeyhole className="w-3.5 h-3.5 text-[#dd7700]" />
            <span>Secured by</span>
            <div className="relative flex items-center justify-start w-[50px] h-[16px] overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={providers[index]}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#dd7700] absolute left-0"
                >
                  {providers[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {authError && (
          <div className="mb-5 p-2 bg-[#440000] border border-[#ff0000] text-[#ffaaaa] text-[13px] font-bold text-center">
            Error: {authError}
          </div>
        )}

        {/* Main Form */}
        <div className="space-y-4">
          {pendingMfa || pendingVerification ? (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#aaaaaa] uppercase tracking-wide">
                  Security Code
                </label>
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
                  className={`${inputClass} text-center text-xl tracking-[0.2em]`}
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
                  className="w-full text-center text-[13px] text-[#0088ff] font-bold uppercase hover:text-white underline hover:bg-[#0055cc] py-1 cursor-pointer"
                >
                  Cancel and go back
                </button>
              </div>
            </>
          ) : (
            <>
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#aaaaaa] uppercase">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#aaaaaa] uppercase">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#aaaaaa] uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#aaaaaa] uppercase">
                  Password
                </label>
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

              {/* CLERK CAPTCHA RESTORED EXACTLY */}
              <div
                id="clerk-captcha"
                data-cl-theme="dark"
                data-cl-size="flexible"
                className="pt-3"
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
                    "Log In"
                  )}
                </button>

                <div className="border-t border-[#444444] w-full my-2"></div>

                <button onClick={toggleMode} className={secondaryButtonClass}>
                  {isSignUp ? "Switch to Login" : "Create New Account"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[11px] font-bold text-[#888888] uppercase bg-[#111111] p-2 border border-[#333333]">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-[#0088ff] underline hover:bg-[#0055cc] hover:text-white px-1"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-[#0088ff] underline hover:bg-[#0055cc] hover:text-white px-1"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
