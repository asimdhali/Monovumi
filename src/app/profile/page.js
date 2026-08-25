"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getUserRevisions, removeRevision } from "../services/revisionService";

function InfoRow({ icon, label, value }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <span
        className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-base"
        style={{
          background: "var(--color-app-primary-soft)",
        }}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[11px] text-[var(--color-app-muted)]">{label}</p>

        <p className="text-sm font-medium truncate text-[var(--color-app-text)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function InterestTags({ interests }) {
  if (!interests?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {interests.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            background: "var(--color-app-primary-soft)",
            color: "var(--color-app-primary)",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function StatCard({ value, label, bg, color }) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: bg }}>
      <p className="text-lg font-bold" style={{ color }}>
        {value}
      </p>

      <p className="text-[11px] text-[var(--color-app-muted)]">{label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { user, profile, loading, updateProfile, logout, approved, role } =
    useAuth();

  const [editing, setEditing] = useState(false);

  const [draft, setDraft] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [revisionLoading, setRevisionLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setRevisions([]);
      setRevisionLoading(false);
      return;
    }

    async function loadRevisions() {
      try {
        setRevisionLoading(true);

        const data = await getUserRevisions(user.uid);

        setRevisions(data);
      } catch (error) {
        console.error("Revision load error:", error);
      } finally {
        setRevisionLoading(false);
      }
    }

    loadRevisions();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="w-full px-3 sm:px-4 lg:px-6 pt-4 sm:pt-6 pb-24">
        <div className="w-full rounded-2xl p-5 mb-4 text-white relative overflow-hidden">
          {/* ================= HERO SKELETON ================= */}
          <div
            className="rounded-2xl p-5 mb-4 relative overflow-hidden"
            style={{
              background: "var(--color-app-surface)",
              border: "1px solid var(--color-app-border)",
            }}
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-full shrink-0 animate-pulse"
                style={{
                  background: "var(--color-app-border)",
                }}
              />

              <div className="flex-1 space-y-2">
                {/* Name */}
                <div
                  className="h-5 w-32 rounded-md animate-pulse"
                  style={{
                    background: "var(--color-app-border)",
                  }}
                />

                {/* Email */}
                <div
                  className="h-3 w-44 rounded-md animate-pulse"
                  style={{
                    background: "var(--color-app-border)",
                  }}
                />

                {/* Role */}
                <div
                  className="h-5 w-24 rounded-full animate-pulse"
                  style={{
                    background: "var(--color-app-border)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ================= পরিচিতি SKELETON ================= */}
          <div
            className="rounded-2xl border p-4"
            style={{
              background: "var(--color-app-surface)",
              borderColor: "var(--color-app-border)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              {/* Title */}
              <div
                className="h-4 w-16 rounded-md animate-pulse"
                style={{
                  background: "var(--color-app-border)",
                }}
              />

              {/* Edit button */}
              <div
                className="h-7 w-24 rounded-full animate-pulse"
                style={{
                  background: "var(--color-app-border)",
                }}
              />
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-full shrink-0 animate-pulse"
                    style={{
                      background: "var(--color-app-border)",
                    }}
                  />

                  <div className="flex-1 space-y-1.5 pt-1">
                    {/* Label */}
                    <div
                      className="h-2.5 w-16 rounded animate-pulse"
                      style={{
                        background: "var(--color-app-border)",
                      }}
                    />

                    {/* Value */}
                    <div
                      className={`h-3 rounded animate-pulse ${
                        item % 2 === 0 ? "w-36" : "w-48"
                      }`}
                      style={{
                        background: "var(--color-app-border)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= আগ্রহ SKELETON ================= */}
          <div
            className="rounded-2xl border p-4 mt-4"
            style={{
              background: "var(--color-app-surface)",
              borderColor: "var(--color-app-border)",
            }}
          >
            {/* Title */}
            <div
              className="h-4 w-28 rounded-md animate-pulse mb-4"
              style={{
                background: "var(--color-app-border)",
              }}
            />

            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`h-7 rounded-full animate-pulse ${
                    item === 1 ? "w-16" : item === 2 ? "w-20" : "w-14"
                  }`}
                  style={{
                    background: "var(--color-app-border)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-10 text-center">
        <div
          className="rounded-2xl border p-8"
          style={{
            background: "var(--color-app-surface)",
            borderColor: "var(--color-app-border)",
          }}
        >
          <div className="text-4xl mb-3">🔐</div>

          <h2 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)]">
            লগইন করুন
          </h2>

          <p className="text-sm mt-2 text-[var(--color-app-muted)]">
            আপনার প্রোফাইল দেখতে প্রথমে Google দিয়ে লগইন করুন।
          </p>
        </div>
      </div>
    );
  }

  function startEdit() {
    setDraft({
      name: profile.name || "",
      birthDate: profile.birthDate || "",
      institution: profile.institution || "",
      classLevel: profile.classLevel || "",
      location: profile.location || "",
      interests: profile.interests || [],
    });

    setEditing(true);
  }

  async function saveProfile() {
    try {
      await updateProfile({
        name: draft.name.trim(),
        birthDate: draft.birthDate || "",
        institution: draft.institution.trim(),
        classLevel: draft.classLevel.trim(),
        location: draft.location.trim(),
        interests: draft.interests,
      });

      setEditing(false);
    } catch (error) {
      console.error(error);
      alert("প্রোফাইল সংরক্ষণ করা যায়নি।");
    }
  }

  return (
    <div className="w-full px-3 sm:px-4 lg:px-6 pt-4 sm:pt-6 pb-24">
      <div className="w-full rounded-2xl p-5 mb-4 text-white relative overflow-hidden">
        {/* ================= HERO ================= */}

        <div
          className="rounded-2xl p-5 mb-4 text-white relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--color-app-primary), #2a4a3f)",
          }}
        >
          <div
            className="absolute -right-8 -top-8 w-32 h-32 rounded-full"
            style={{
              background: "rgba(255,255,255,0.08)",
            }}
          />

          <div className="relative flex items-center gap-4">
            <img
              src={profile.photoURL || "https://i.pravatar.cc/150?img=13"}
              alt={profile.name || "প্রোফাইল"}
              className="w-16 h-16 rounded-full ring-2 ring-white/70 object-cover"
            />

            <div className="min-w-0">
              <p className="font-[family-name:var(--font-bengali-serif)] text-lg leading-tight">
                {profile.name || "আপনি"}
              </p>

              <p className="text-[11px] text-white/75 mt-1 truncate">
                {profile.email}
              </p>

              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/15">
                {profile.role === "teacher"
                  ? "মনোভূমি শিক্ষক"
                  : "মনোভূমি শিক্ষার্থী"}
              </span>
            </div>
          </div>
        </div>

        {/* ================= পরিচিতি ================= */}

        <div
          className="w-full rounded-2xl border p-4 bg-[var(--color-app-surface)]"
          style={{
            borderColor: "var(--color-app-border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-app-text)]">
              পরিচিতি
            </h3>

            <button
              onClick={startEdit}
              className="text-xs font-medium px-3 py-1.5 rounded-full"
              style={{
                background: "var(--color-app-primary-soft)",
                color: "var(--color-app-primary)",
              }}
            >
              ✏️ সম্পাদনা করুন
            </button>
          </div>

          <div className="space-y-3.5">
            <InfoRow icon="👤" label="নাম" value={profile.name} />

            <InfoRow icon="✉️" label="ই-মেইল" value={profile.email} />

            <InfoRow icon="🎂" label="জন্মতারিখ" value={profile.birthDate} />

            <InfoRow
              icon="🏫"
              label="শিক্ষা প্রতিষ্ঠান"
              value={profile.institution}
            />

            <InfoRow icon="📘" label="শ্রেণি" value={profile.classLevel} />

            <InfoRow icon="📍" label="অবস্থান" value={profile.location} />

            {profile.createdAt && (
              <InfoRow
                icon="📅"
                label="মনোভূমিতে যোগদান"
                value={new Date(profile.createdAt).toLocaleDateString("bn-BD")}
              />
            )}
          </div>
        </div>

        {/* ================= আগ্রহ ================= */}

        {profile.interests?.length > 0 && (
          <div
            className="w-full rounded-2xl border p-4 mt-4 bg-[var(--color-app-surface)]"
            style={{
              borderColor: "var(--color-app-border)",
            }}
          >
            <h3 className="text-sm font-semibold mb-3 text-[var(--color-app-text)]">
              ✨ আগ্রহের বিষয়
            </h3>

            <InterestTags interests={profile.interests} />
          </div>
        )}

        {/* ================= আমার রিভিশন ================= */}

        <div
          className="w-full rounded-2xl border p-4 mt-4 bg-[var(--color-app-surface)]"
          style={{
            borderColor: "var(--color-app-border)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-app-text)]">
              📚 আমার রিভিশন
            </h3>

            {!revisionLoading && revisions.length > 0 && (
              <span className="text-[11px] text-[var(--color-app-muted)]">
                {revisions.length}টি
              </span>
            )}
          </div>

          {revisionLoading ? (
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-xl p-3 animate-pulse"
                  style={{
                    background: "var(--color-app-bg)",
                  }}
                >
                  <div
                    className="h-4 w-3/4 rounded mb-2"
                    style={{
                      background: "var(--color-app-border)",
                    }}
                  />

                  <div
                    className="h-3 w-full rounded"
                    style={{
                      background: "var(--color-app-border)",
                    }}
                  />

                  <div
                    className="h-3 w-1/2 rounded mt-2"
                    style={{
                      background: "var(--color-app-border)",
                    }}
                  />
                </div>
              ))}
            </div>
          ) : revisions.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">📖</div>

              <p className="text-sm text-[var(--color-app-muted)]">
                এখনো কোনো পোস্ট রিভিশনে যোগ করা হয়নি।
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {revisions.map((revision) => (
                <div
                  key={revision.docId}
                  className="rounded-xl border p-3"
                  style={{
                    background: "var(--color-app-bg)",
                    borderColor: "var(--color-app-border)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {revision.title && (
                        <p className="text-sm font-semibold text-[var(--color-app-text)]">
                          {revision.title}
                        </p>
                      )}

                      <p
                        className={`text-[12px] leading-relaxed text-[var(--color-app-muted)] ${
                          revision.title ? "mt-1" : ""
                        }`}
                      >
                        {revision.content
                          ?.replace(/<[^>]*>/g, "")
                          .slice(0, 150)}
                        {revision.content?.replace(/<[^>]*>/g, "").length > 150
                          ? "..."
                          : ""}
                      </p>

                      {(revision.subject || revision.paperTitle) && (
                        <p className="text-[10px] mt-2 text-[var(--color-app-muted)]">
                          📖 {revision.subject}
                          {revision.paperTitle
                            ? ` › ${revision.paperTitle}`
                            : ""}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={async () => {
                        const ok = window.confirm(
                          "এই পোস্টটি রিভিশন থেকে মুছে ফেলবেন?",
                        );

                        if (!ok) return;

                        try {
                          await removeRevision(revision.docId);

                          setRevisions((prev) =>
                            prev.filter(
                              (item) => item.docId !== revision.docId,
                            ),
                          );
                        } catch (error) {
                          console.error("Revision remove error:", error);

                          alert("রিভিশন থেকে মুছে ফেলা যায়নি।");
                        }
                      }}
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-red-500/10"
                      style={{
                        color: "var(--color-app-muted)",
                      }}
                      aria-label="রিভিশন মুছুন"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= LOGOUT ================= */}

        <button
          onClick={logout}
          className="w-full mt-4 py-3 rounded-full text-sm font-semibold border"
          style={{
            borderColor: "var(--color-app-border)",
            color: "var(--color-app-muted)",
          }}
        >
          লগআউট
        </button>

        {/* ================= EDIT MODAL ================= */}

        {editing && draft && (
          <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4">
            <div
              className="w-full max-w-lg rounded-2xl p-5 max-h-[85vh] overflow-y-auto"
              style={{
                background: "var(--color-app-surface)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)]">
                  প্রোফাইল সম্পাদনা
                </h3>

                <button
                  onClick={() => setEditing(false)}
                  className="text-lg text-[var(--color-app-muted)]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {/* নাম */}

                <div>
                  <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
                    নাম
                  </p>

                  <input
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border text-sm bg-[var(--color-app-bg)] text-[var(--color-app-text)]"
                    style={{
                      borderColor: "var(--color-app-border)",
                    }}
                  />
                </div>

                {/* Email */}

                <div>
                  <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
                    ই-মেইল
                  </p>

                  <input
                    value={profile.email || ""}
                    disabled
                    className="w-full p-2.5 rounded-lg border text-sm opacity-60 bg-[var(--color-app-bg)] text-[var(--color-app-text)]"
                    style={{
                      borderColor: "var(--color-app-border)",
                    }}
                  />
                </div>

                {/* জন্মতারিখ */}

                <div>
                  <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
                    জন্মতারিখ
                  </p>

                  <input
                    type="date"
                    value={draft.birthDate}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        birthDate: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border text-sm bg-[var(--color-app-bg)] text-[var(--color-app-text)]"
                    style={{
                      borderColor: "var(--color-app-border)",
                    }}
                  />
                </div>

                {/* প্রতিষ্ঠান */}

                <div>
                  <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
                    শিক্ষা প্রতিষ্ঠান
                  </p>

                  <input
                    value={draft.institution}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        institution: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border text-sm bg-[var(--color-app-bg)] text-[var(--color-app-text)]"
                    style={{
                      borderColor: "var(--color-app-border)",
                    }}
                  />
                </div>

                {/* শ্রেণি */}

                <div>
                  <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
                    শ্রেণি
                  </p>

                  <input
                    value={draft.classLevel}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        classLevel: e.target.value,
                      })
                    }
                    placeholder="যেমন: নবম শ্রেণি"
                    className="w-full p-2.5 rounded-lg border text-sm bg-[var(--color-app-bg)] text-[var(--color-app-text)]"
                    style={{
                      borderColor: "var(--color-app-border)",
                    }}
                  />
                </div>

                {/* অবস্থান */}

                <div>
                  <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
                    অবস্থান
                  </p>

                  <input
                    value={draft.location}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        location: e.target.value,
                      })
                    }
                    placeholder="যেমন: কুষ্টিয়া, বাংলাদেশ"
                    className="w-full p-2.5 rounded-lg border text-sm bg-[var(--color-app-bg)] text-[var(--color-app-text)]"
                    style={{
                      borderColor: "var(--color-app-border)",
                    }}
                  />
                </div>

                {/* আগ্রহ */}

                <div>
                  <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
                    আগ্রহের বিষয়
                  </p>

                  <input
                    value={draft.interests?.join(", ") || ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        interests: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="বিজ্ঞান, গণিত, ইতিহাস"
                    className="w-full p-2.5 rounded-lg border text-sm bg-[var(--color-app-bg)] text-[var(--color-app-text)]"
                    style={{
                      borderColor: "var(--color-app-border)",
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={saveProfile}
                  className="flex-1 py-2.5 rounded-full text-white text-sm font-semibold"
                  style={{
                    background: "var(--color-app-primary)",
                  }}
                >
                  সংরক্ষণ করুন
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold border"
                  style={{
                    borderColor: "var(--color-app-border)",
                    color: "var(--color-app-muted)",
                  }}
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
