"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const TEACHER_PASSWORD = "vumi"; // এখানে বদলালে সব জায়গায় বদলে যাবে

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState("student"); // 'student' অথবা 'teacher'
  const [teacherVerified, setTeacherVerified] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // প্রথমবার পেজ লোড হওয়ার সময় localStorage থেকে আগের অবস্থা ফিরিয়ে আনো
  useEffect(() => {
    const savedRole = localStorage.getItem("monovumi_role");
    const savedVerified = localStorage.getItem("monovumi_teacherVerified");
    if (savedRole === "teacher" && savedVerified === "true") {
      setRole("teacher");
      setTeacherVerified(true);
    }
    setLoaded(true);
  }, []);

  // role/teacherVerified বদলালে localStorage-এ সেভ করো
  useEffect(() => {
    if (!loaded) return; // প্রথম লোডের সময় ওভাররাইট করা এড়াও
    localStorage.setItem("monovumi_role", role);
    localStorage.setItem("monovumi_teacherVerified", String(teacherVerified));
  }, [role, teacherVerified, loaded]);

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
