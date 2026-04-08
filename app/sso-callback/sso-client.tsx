"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { FaSpinner } from "react-icons/fa";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-zinc-950 text-zinc-400">
      <FaSpinner className="animate-spin text-3xl text-blue-500" />
      <p className="text-sm animate-pulse">Authenticating...</p>

      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
      />
    </div>
  );
}
