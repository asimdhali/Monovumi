"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------
  // Firebase login state
  // ---------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);

        // লগইন করা নেই
        if (!currentUser) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        // ---------------------------------------------------
        // নতুন user
        // ---------------------------------------------------
        if (!userSnap.exists()) {
          const newProfile = {
            uid: currentUser.uid,

            name: currentUser.displayName || "",
            email: currentUser.email || "",
            photoURL: currentUser.photoURL || "",

            role: "student",
            approved: false,

            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          await setDoc(userRef, newProfile);

          setProfile(newProfile);
        } else {
          // -------------------------------------------------
          // পুরোনো user
          // -------------------------------------------------
          const existingProfile = userSnap.data();

          const updatedProfile = {
            ...existingProfile,

            uid: currentUser.uid,
            name: currentUser.displayName || existingProfile.name || "",
            email: currentUser.email || existingProfile.email || "",
            photoURL: currentUser.photoURL || existingProfile.photoURL || "",

            role: existingProfile.role || "student",

            approved: existingProfile.approved === true,

            updatedAt: Date.now(),
          };

          await setDoc(userRef, updatedProfile, {
            merge: true,
          });

          setProfile(updatedProfile);
        }
      } catch (error) {
        console.error("Auth profile error:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // ---------------------------------------------------------
  // Google Login
  // ---------------------------------------------------------
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);

    return result.user;
  }

  // ---------------------------------------------------------
  // Logout
  // ---------------------------------------------------------
  async function logout() {
    await signOut(auth);
  }

  // ---------------------------------------------------------
  // Permission system
  // ---------------------------------------------------------

  // approved হলেই পোস্ট করা যাবে
  const canPost = profile?.approved === true;

  // approved + teacher/admin হলে management করা যাবে
  const canManage =
    profile?.approved === true &&
    (profile?.role === "teacher" || profile?.role === "admin");

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,

        // Authentication
        loginWithGoogle,
        logout,

        // Permission
        canPost,
        canManage,

        // User information
        role: profile?.role || "student",
        approved: profile?.approved === true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
