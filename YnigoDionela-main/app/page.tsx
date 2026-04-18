"use client";

import { useEffect, useState } from "react";
import LoginPage from "@/components/LoginPage";
import SelectOTPPage from "@/components/SelectOTPPage";
import SetPasswordPage from "@/components/SetPasswordPage";
import SuccessPage from "@/components/SuccessPage";
import { clearStoredSession, type RecoverySession } from "@/lib/supabaseAuth";

export type Screen = "login" | "select-otp" | "set-password" | "success";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("login");
  const [recoverySession, setRecoverySession] = useState<RecoverySession | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;

    if (!hash) return;

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token") ?? "";
    const type = params.get("type");

    if (type === "recovery" && accessToken) {
      setRecoverySession({
        accessToken,
        refreshToken,
        type,
      });
      setScreen("set-password");
      clearStoredSession();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: 0,
        margin: 0,
      }}
    >
      {screen === "login" && <LoginPage onForgotPassword={() => setScreen("select-otp")} />}
      {screen === "select-otp" && (
        <SelectOTPPage
          onBack={() => setScreen("login")}
          onNext={() => setScreen("success")}
        />
      )}
      {screen === "set-password" && (
        <SetPasswordPage
          recoverySession={recoverySession}
          onBack={() => setScreen("login")}
          onNext={() => setScreen("success")}
        />
      )}
      {screen === "success" && (
        <SuccessPage
          onSignIn={() => {
            setRecoverySession(null);
            setScreen("login");
          }}
          mode={recoverySession ? "password-updated" : "email-sent"}
        />
      )}
    </main>
  );
}
