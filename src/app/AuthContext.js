"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState("student"); // 'student' অথবা 'teacher'
  const [teacherVerified, setTeacherVerified] = useState(false);

  return (
    <AuthContext.Provider
      value={{ role, setRole, teacherVerified, setTeacherVerified }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
