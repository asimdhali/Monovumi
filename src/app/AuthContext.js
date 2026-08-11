"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const TEACHER_PASSWORD = "vumi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState("student");
  const [teacherVerified, setTeacherVerified] = useState(false);

  // নতুন
  const [userName, setUserName] = useState("");

  const [loaded, setLoaded] = useState(false);

  // প্রথমবার পেজ লোড
  useEffect(() => {
    const savedRole = localStorage.getItem("monovumi_role");
    const savedVerified = localStorage.getItem("monovumi_teacherVerified");

    // নতুন
    const savedUserName = localStorage.getItem("monovumi_userName");

    if (savedRole === "teacher" && savedVerified === "true") {
      setRole("teacher");
      setTeacherVerified(true);
    }

    // নতুন
    if (savedUserName) {
      setUserName(savedUserName);
    }

    setLoaded(true);
  }, []);

  // role / teacher / name সংরক্ষণ
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("monovumi_role", role);

    localStorage.setItem("monovumi_teacherVerified", String(teacherVerified));

    // নতুন
    if (userName.trim()) {
      localStorage.setItem("monovumi_userName", userName.trim());
    }
  }, [role, teacherVerified, userName, loaded]);

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,

        teacherVerified,
        setTeacherVerified,

        // নতুন
        userName,
        setUserName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
