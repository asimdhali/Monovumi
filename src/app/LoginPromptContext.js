"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import LoginPromptModal from "./LoginPromptModal";
import { useAuth } from "./AuthContext";

const LoginPromptContext = createContext(null);

export function LoginPromptProvider({ children }) {
  const [visible, setVisible] = useState(false);

  const { user, loading } = useAuth();

  // একই mount-এ একাধিকবার modal খোলা ঠেকাবে
  const hasCheckedInitialAuth = useRef(false);

  // ---------------------------------------------------------
  // Page refresh হলে login না করা user-কে Login Prompt দেখানো
  // ---------------------------------------------------------
  useEffect(() => {
    // Firebase এখনো auth state নির্ধারণ না করলে অপেক্ষা করব
    if (loading) return;

    // একইবারের check আবার না করার জন্য
    if (hasCheckedInitialAuth.current) return;

    hasCheckedInitialAuth.current = true;

    // Login করা না থাকলে modal দেখাও
    if (!user) {
      setVisible(true);
    }
  }, [loading, user]);

  function openLoginPrompt() {
    setVisible(true);
  }

  function closeLoginPrompt() {
    setVisible(false);
  }

  return (
    <LoginPromptContext.Provider
      value={{
        openLoginPrompt,
        closeLoginPrompt,
      }}
    >
      {children}

      <LoginPromptModal visible={visible} onClose={closeLoginPrompt} />
    </LoginPromptContext.Provider>
  );
}

export function useLoginPrompt() {
  const context = useContext(LoginPromptContext);

  if (!context) {
    throw new Error("useLoginPrompt must be used inside LoginPromptProvider");
  }

  return context;
}
