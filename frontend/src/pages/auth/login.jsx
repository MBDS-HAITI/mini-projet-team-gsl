import React from "react";
import { SignIn, useClerk } from "@clerk/clerk-react";
import { Loader } from "lucide-react";

export default function Login() {
  const clerk = useClerk();

  if (!clerk || !clerk.loaded) {
    return (
      <div className="max-w-xs w-full h-full flex justify-center items-center">
        <Loader className="animate-spin size-8" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs">
      <SignIn fallbackRedirectUrl="/dashboard" />
    </div>
  );
}
