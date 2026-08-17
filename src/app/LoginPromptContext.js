"use client";

import { createContext, useContext, useState } from "react";
import LoginPromptModal from "./LoginPromptModal";

const LoginPromptContext = createContext(null);

export function LoginPromptProvider({ children }) {
  const [visible, setVisible] = useState(false);

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
