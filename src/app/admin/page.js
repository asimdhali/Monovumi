"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { db } from "../firebase";
import { useAuth } from "../AuthContext";

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // ---------------------------------------------------------
  // শুধু admin ঢুকতে পারবে
  // ---------------------------------------------------------
  useEffect(() => {
    if (loading) return;

    if (!user || profile?.role !== "admin" || profile?.approved !== true) {
      router.replace("/");
    }
  }, [user, profile, loading, router]);

  // ---------------------------------------------------------
  // সব user load
  // ---------------------------------------------------------
  useEffect(() => {
    async function loadUsers() {
      if (!profile || profile.role !== "admin") return;

      try {
        const snapshot = await getDocs(collection(db, "users"));

        const userList = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setUsers(userList);
      } catch (error) {
        console.error("Users load error:", error);
      } finally {
        setLoadingUsers(false);
      }
    }

    if (!loading) {
      loadUsers();
    }
  }, [profile, loading]);

  // ---------------------------------------------------------
  // Permission পরিবর্তন
  // ---------------------------------------------------------
  async function updatePermission(uid, role, approved) {
    try {
      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, {
        role,
        approved,
        updatedAt: Date.now(),
      });

      setUsers((prev) =>
        prev.map((item) =>
          item.id === uid
            ? {
                ...item,
                role,
                approved,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Permission update error:", error);
      alert("অনুমতি পরিবর্তন করা যায়নি।");
    }
  }

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--color-app-muted)]">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!user || profile?.role !== "admin" || profile?.approved !== true) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[var(--color-app-bg)] px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-app-text)]">
            Owner Panel
          </h1>

          <p className="text-sm mt-1 text-[var(--color-app-muted)]">
            ব্যবহারকারীদের পোস্ট ও এডিট করার অনুমতি পরিচালনা করুন।
          </p>
        </div>

        <div className="space-y-3">
          {users.map((item) => {
            const isOwner = item.role === "admin";

            return (
              <div
                key={item.id}
                className="rounded-2xl border p-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)]"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={item.photoURL}
                    alt=""
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--color-app-text)]">
                      {item.name || "নাম নেই"}
                    </p>

                    <p className="text-xs mt-0.5 text-[var(--color-app-muted)] break-all">
                      {item.email}
                    </p>

                    <div className="flex gap-2 mt-2">
                      <span className="text-[11px] px-2 py-1 rounded-full bg-[var(--color-app-bg)] text-[var(--color-app-muted)]">
                        {item.role === "admin"
                          ? "👑 Admin"
                          : item.role === "teacher"
                            ? "👨‍🏫 Teacher"
                            : "🎓 Student"}
                      </span>

                      <span
                        className="text-[11px] px-2 py-1 rounded-full"
                        style={{
                          background: item.approved
                            ? "var(--color-app-primary-soft)"
                            : "var(--color-app-bg)",
                          color: item.approved
                            ? "var(--color-app-primary)"
                            : "var(--color-app-muted)",
                        }}
                      >
                        {item.approved ? "অনুমোদিত" : "অনুমোদিত নয়"}
                      </span>
                    </div>
                  </div>
                </div>

                {!isOwner && (
                  <div className="flex gap-2 mt-4">
                    {item.approved && item.role === "teacher" ? (
                      <button
                        onClick={() =>
                          updatePermission(item.id, "student", false)
                        }
                        className="flex-1 py-2 rounded-full text-xs font-semibold border border-[var(--color-app-border)] text-[var(--color-app-muted)]"
                      >
                        অনুমতি বাতিল করুন
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          updatePermission(item.id, "teacher", true)
                        }
                        className="flex-1 py-2 rounded-full text-xs font-semibold text-white"
                        style={{
                          background: "var(--color-app-primary)",
                        }}
                      >
                        👨‍🏫 শিক্ষক হিসেবে অনুমতি দিন
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
