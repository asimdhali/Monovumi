"use client";

import { useState } from "react";
import { progressData } from "../data";
import { useAuth, TEACHER_PASSWORD } from "../AuthContext";

/* ---------------------------------------------------------
   ডিফল্ট প্রোফাইল তথ্য — বাস্তব অ্যাপে এগুলো data.js বা
   Firestore থেকে আসবে। আপাতত ডেমো হিসেবে লোকাল স্টেটে রাখা হলো
   যাতে "সম্পাদনা করুন" বাটন দিয়ে টেস্ট করা যায়।
--------------------------------------------------------- */
const defaultStudentProfile = {
  name: "আপনি",
  institution: "মনোভূমি একাডেমি",
  classLevel: "নবম শ্রেণি",
  location: "কুষ্টিয়া, বাংলাদেশ",
  joined: "জানুয়ারি ২০২৫",
  interests: ["বিজ্ঞান", "গণিত", "ইতিহাস", "সাহিত্য"],
};

const defaultTeacherProfile = {
  name: "আপনি",
  designation: "সহকারী শিক্ষক · বিজ্ঞান বিভাগ",
  institution: "মনোভূমি একাডেমি",
  education: "এম.এসসি (পদার্থবিজ্ঞান), ঢাকা বিশ্ববিদ্যালয়",
  location: "কুষ্টিয়া, বাংলাদেশ",
  experience: "৫ বছরের শিক্ষকতার অভিজ্ঞতা",
  joined: "মার্চ ২০২৪",
  interests: ["বিজ্ঞান শিক্ষা", "নৈতিক শিক্ষা", "MCQ প্রণয়ন"],
  bio: "শিক্ষার্থীদের সহজ ভাষায় বিজ্ঞান বোঝাতে ভালোবাসি। মনোভূমিতে নিয়মিত নোট ও প্রশ্ন যুক্ত করি, যাতে সবাই বিনামূল্যে মানসম্মত শিক্ষা পায়।",
  stats: { posts: 42, notes: 18, mcqs: 210, studentsHelped: 1240 },
};

/* ছোট সহায়ক উপাদান: তথ্যচিহ্ন সহ একটি লেবেল-ভ্যালু সারি */
function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span
        className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-base"
        style={{ background: "var(--color-app-primary-soft)" }}
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

function InterestTags({ interests, tone = "primary" }) {
  if (!interests?.length) return null;
  const bg =
    tone === "primary"
      ? "var(--color-app-primary-soft)"
      : "var(--color-app-accent-soft)";
  const color =
    tone === "primary" ? "var(--color-app-primary)" : "var(--color-app-accent)";
  return (
    <div className="flex flex-wrap gap-2">
      {interests.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: bg, color }}
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
  const { role, setRole, teacherVerified, setTeacherVerified } = useAuth();
  const [profile, setProfile] = useState(defaultStudentProfile);
  const weakest = [...progressData.subjects].sort(
    (a, b) => a.strength - b.strength,
  )[0];

  if (role === "teacher") {
    return (
      <TeacherView
        teacherVerified={teacherVerified}
        setTeacherVerified={setTeacherVerified}
        onBack={() => setRole("student")}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 pt-6 pb-10">
      {/* ---------- হিরো কার্ড ---------- */}
      <div
        className="rounded-2xl p-5 mb-4 text-white relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-app-primary), #2a4a3f)",
        }}
      >
        <div
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div className="relative flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/150?img=13"
            alt="প্রোফাইল"
            className="w-16 h-16 rounded-full ring-2 ring-white/70"
          />
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-bengali-serif)] text-lg leading-tight">
              {profile.name}
            </p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/15">
              মনোভূমি শিক্ষার্থী
            </span>
          </div>
        </div>
      </div>

      {/* ---------- পরিচিতি তথ্য ---------- */}
      <ProfileInfoCard
        profile={profile}
        setProfile={setProfile}
        role="student"
      />

      {/* ---------- আগ্রহ ---------- */}
      <div className="rounded-2xl border p-4 mt-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
        <h3 className="text-sm font-semibold mb-3 text-[var(--color-app-text)]">
          ✨ আগ্রহের বিষয়
        </h3>
        <InterestTags interests={profile.interests} tone="primary" />
      </div>

      {/* ---------- অগ্রগতি ---------- */}
      <div className="rounded-2xl border p-4 mt-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
        <h3 className="font-[family-name:var(--font-bengali-serif)] text-base mb-3 text-[var(--color-app-text)]">
          📊 আমার অগ্রগতি
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard
            value={`${progressData.studyMinutesToday} মিনিট`}
            label="আজকের অধ্যয়ন"
            bg="var(--color-app-primary-soft)"
            color="var(--color-app-primary)"
          />
          <StatCard
            value={`🔥 ${progressData.streakDays} দিন`}
            label="টানা অধ্যয়ন"
            bg="var(--color-app-accent-soft)"
            color="var(--color-app-accent)"
          />
        </div>

        <p className="text-xs font-medium mb-2 text-[var(--color-app-text)]">
          বিষয়ভিত্তিক দক্ষতা
        </p>
        <div className="space-y-2.5">
          {progressData.subjects.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--color-app-text)]">{s.name}</span>
                <span className="text-[var(--color-app-muted)]">
                  {s.strength}%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--color-app-border)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${s.strength}%`,
                    background:
                      s.strength < 50 ? "#ef4444" : "var(--color-app-primary)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-3 rounded-xl p-3 text-xs leading-relaxed text-[var(--color-app-text)]"
          style={{ background: "var(--color-app-accent-soft)" }}
        >
          💡 <strong>{weakest.name}</strong> বিষয়ে আপনার দুর্বলতা বেশি — এই
          বিষয়ে আরও অনুশীলন প্রয়োজন।
        </div>
      </div>

      <button
        onClick={() => setRole("teacher")}
        className="w-full mt-4 py-3 rounded-full text-sm font-semibold border transition-colors"
        style={{
          borderColor: "var(--color-app-primary)",
          color: "var(--color-app-primary)",
        }}
      >
        👑 আমি একজন শিক্ষক
      </button>
    </div>
  );
}

/* ---------------------------------------------------------
   পরিচিতি তথ্য কার্ড — দেখা ও সম্পাদনা দুই মোডেই কাজ করে,
   শিক্ষার্থী ও শিক্ষক উভয়ের জন্য পুনঃব্যবহারযোগ্য
--------------------------------------------------------- */
function ProfileInfoCard({ profile, setProfile, role }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  function startEdit() {
    setDraft(profile);
    setEditing(true);
  }

  function save() {
    setProfile(draft);
    setEditing(false);
  }

  const field = (key) => (
    <input
      value={draft[key] ?? ""}
      onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
      className="w-full p-2.5 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
    />
  );

  if (editing) {
    return (
      <div className="rounded-2xl border p-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
        <h3 className="text-sm font-semibold mb-3 text-[var(--color-app-text)]">
          ✏️ প্রোফাইল সম্পাদনা
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
              নাম
            </p>
            {field("name")}
          </div>
          {role === "teacher" && (
            <div>
              <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
                পদবী
              </p>
              {field("designation")}
            </div>
          )}
          <div>
            <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
              {role === "teacher" ? "কর্মস্থল" : "শিক্ষা প্রতিষ্ঠান"}
            </p>
            {field("institution")}
          </div>
          {role === "teacher" ? (
            <div>
              <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
                শিক্ষাগত যোগ্যতা
              </p>
              {field("education")}
            </div>
          ) : (
            <div>
              <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
                শ্রেণি
              </p>
              {field("classLevel")}
            </div>
          )}
          <div>
            <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
              অবস্থান
            </p>
            {field("location")}
          </div>
          <div>
            <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
              আগ্রহ (কমা দিয়ে আলাদা করুন)
            </p>
            <input
              value={draft.interests?.join(", ") ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  interests: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="w-full p-2.5 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
            />
          </div>
          {role === "teacher" && (
            <div>
              <p className="text-[11px] mb-1 text-[var(--color-app-muted)]">
                সংক্ষিপ্ত পরিচিতি
              </p>
              <textarea
                value={draft.bio ?? ""}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                rows={3}
                className="w-full p-2.5 rounded-lg border text-sm resize-none bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={save}
            className="flex-1 py-2.5 rounded-full text-white text-sm font-semibold"
            style={{ background: "var(--color-app-primary)" }}
          >
            সংরক্ষণ করুন
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold border border-[var(--color-app-border)] text-[var(--color-app-muted)]"
          >
            বাতিল
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
      <div className="flex items-center justify-between mb-3">
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
        {role === "teacher" && (
          <InfoRow icon="🎓" label="পদবী" value={profile.designation} />
        )}
        <InfoRow
          icon="🏫"
          label={role === "teacher" ? "কর্মস্থল" : "শিক্ষা প্রতিষ্ঠান"}
          value={profile.institution}
        />
        {role === "teacher" ? (
          <InfoRow
            icon="📘"
            label="শিক্ষাগত যোগ্যতা"
            value={profile.education}
          />
        ) : (
          <InfoRow icon="📘" label="শ্রেণি" value={profile.classLevel} />
        )}
        {role === "teacher" && (
          <InfoRow icon="🕒" label="অভিজ্ঞতা" value={profile.experience} />
        )}
        <InfoRow icon="📍" label="অবস্থান" value={profile.location} />
        <InfoRow icon="📅" label="যোগদান" value={profile.joined} />
      </div>
    </div>
  );
}

function TeacherView({ teacherVerified, setTeacherVerified, onBack }) {
  const [step, setStep] = useState(0); // 0=শুরু, 1=ফোন, 2=OTP, 3=NID, 4=যাচাই হচ্ছে
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [nid, setNid] = useState("");
  const [profile, setProfile] = useState(defaultTeacherProfile);

  if (teacherVerified) {
    const { stats } = profile;
    return (
      <div className="max-w-2xl mx-auto px-4 lg:px-6 pt-6 pb-10">
        {/* ---------- প্রিমিয়াম হিরো ---------- */}
        <div
          className="rounded-2xl p-6 text-center text-white mb-4 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--color-app-primary), #2a4a3f)",
          }}
        >
          <div
            className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
          <p className="text-3xl relative">👑</p>
          <img
            src="https://i.pravatar.cc/150?img=13"
            alt="প্রোফাইল"
            className="relative w-20 h-20 rounded-full ring-4 mx-auto mt-1"
            style={{ "--tw-ring-color": "var(--color-app-accent)" }}
          />
          <p className="relative font-[family-name:var(--font-bengali-serif)] text-xl mt-2">
            {profile.name}
          </p>
          <p className="relative text-xs text-white/80 mt-0.5">
            ✓ যাচাইকৃত শিক্ষক · মনোভূমি
          </p>
          <p className="relative text-sm text-white/90 mt-2 font-medium">
            {profile.designation}
          </p>
        </div>

        {/* ---------- অবদান স্ট্যাটস ---------- */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <StatCard
            value={stats.posts}
            label="পোস্ট"
            bg="var(--color-app-primary-soft)"
            color="var(--color-app-primary)"
          />
          <StatCard
            value={stats.notes}
            label="নোট"
            bg="var(--color-app-accent-soft)"
            color="var(--color-app-accent)"
          />
          <StatCard
            value={stats.mcqs}
            label="MCQ"
            bg="var(--color-app-primary-soft)"
            color="var(--color-app-primary)"
          />
          <StatCard
            value={stats.studentsHelped}
            label="শিক্ষার্থী"
            bg="var(--color-app-accent-soft)"
            color="var(--color-app-accent)"
          />
        </div>

        {/* ---------- পরিচিতি ---------- */}
        <ProfileInfoCard
          profile={profile}
          setProfile={setProfile}
          role="teacher"
        />

        {/* ---------- আগ্রহ ---------- */}
        <div className="rounded-2xl border p-4 mt-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
          <h3 className="text-sm font-semibold mb-3 text-[var(--color-app-text)]">
            ✨ আগ্রহের বিষয়
          </h3>
          <InterestTags interests={profile.interests} tone="accent" />
        </div>

        {/* ---------- সংক্ষিপ্ত পরিচিতি ---------- */}
        {profile.bio && (
          <div className="rounded-2xl border p-4 mt-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
            <h3 className="text-sm font-semibold mb-2 text-[var(--color-app-text)]">
              📝 সম্পর্কে
            </h3>
            <p className="text-sm leading-relaxed text-[var(--color-app-muted)]">
              {profile.bio}
            </p>
          </div>
        )}

        <button
          onClick={onBack}
          className="mt-4 text-sm font-medium text-[var(--color-app-muted)]"
        >
          ← শিক্ষার্থী ভিউতে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 pt-6 pb-10">
      {/* ---------- ধাপ নির্দেশক ---------- */}
      {step > 0 && step < 4 && (
        <div className="flex items-center gap-2 mb-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1 flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                style={{
                  background:
                    n <= step
                      ? "var(--color-app-primary)"
                      : "var(--color-app-border)",
                  color: n <= step ? "#fff" : "var(--color-app-muted)",
                }}
              >
                {n}
              </div>
              {n < 3 && (
                <div
                  className="h-0.5 flex-1 rounded-full"
                  style={{
                    background:
                      n < step
                        ? "var(--color-app-primary)"
                        : "var(--color-app-border)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {step === 0 && (
        <div className="rounded-2xl border p-6 text-center bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
          <p className="text-4xl mb-2">🔒</p>
          <h3 className="font-[family-name:var(--font-bengali-serif)] text-base mb-1 text-[var(--color-app-text)]">
            পোস্ট করতে যাচাইকরণ প্রয়োজন
          </h3>
          <p className="text-xs leading-relaxed mb-4 text-[var(--color-app-muted)]">
            মনোভূমিতে শুধুমাত্র যাচাইকৃত শিক্ষকরাই পোস্ট, নোট, এমসিকিউ যোগ করতে
            পারেন।
          </p>
          <button
            onClick={() => setStep(1)}
            className="w-full py-3 rounded-full text-white text-sm font-semibold"
            style={{ background: "var(--color-app-primary)" }}
          >
            ফোন ও NID দিয়ে যাচাই করুন
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="rounded-2xl border p-5 bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
          <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg mb-1 text-[var(--color-app-text)]">
            ধাপ ১ · ফোন নম্বর
          </h3>
          <p className="text-xs mb-3 text-[var(--color-app-muted)]">
            যাচাইকরণের জন্য আপনার সচল ফোন নম্বরটি দিন
          </p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
            className="w-full p-3 rounded-xl border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          />
          <button
            onClick={() => {
              if (phone.length < 11) {
                alert("সঠিক ফোন নম্বর দিন");
                return;
              }
              const code = String(Math.floor(1000 + Math.random() * 9000));
              setDemoOtp(code);
              alert(`ডেমো OTP: ${code}`);
              setStep(2);
            }}
            className="w-full mt-4 py-3 rounded-full text-white text-sm font-semibold"
            style={{ background: "var(--color-app-primary)" }}
          >
            OTP পাঠান
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-2xl border p-5 bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
          <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg mb-1 text-[var(--color-app-text)]">
            ধাপ ২ · OTP যাচাই
          </h3>
          <p className="text-xs mb-3 text-[var(--color-app-muted)]">
            {phone} নম্বরে পাঠানো কোডটি দিন
          </p>
          <input
            type="text"
            maxLength={4}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="৪ সংখ্যার কোড"
            className="w-full p-3 rounded-xl border text-sm text-center tracking-[0.5em] bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          />
          <button
            onClick={() => {
              if (otp !== demoOtp) {
                alert("কোডটি সঠিক নয়");
                return;
              }
              setStep(3);
            }}
            className="w-full mt-4 py-3 rounded-full text-white text-sm font-semibold"
            style={{ background: "var(--color-app-primary)" }}
          >
            যাচাই করুন
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-2xl border p-5 bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
          <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg mb-1 text-[var(--color-app-text)]">
            ধাপ ৩ · জাতীয় পরিচয়পত্র (NID)
          </h3>
          <p className="text-xs mb-3 text-[var(--color-app-muted)]">
            শিক্ষক পরিচয় নিশ্চিত করতে NID নম্বরটি দিন
          </p>
          <input
            type="text"
            value={nid}
            onChange={(e) => setNid(e.target.value)}
            placeholder="NID নম্বর"
            className="w-full p-3 rounded-xl border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          />
          <button
            onClick={() => {
              if (nid.length < 5) {
                alert("সঠিক NID নম্বর দিন");
                return;
              }
              setStep(4);
              setTimeout(() => setTeacherVerified(true), 1600);
            }}
            className="w-full mt-4 py-3 rounded-full text-white text-sm font-semibold"
            style={{ background: "var(--color-app-primary)" }}
          >
            জমা দিন
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="rounded-2xl border p-8 text-center bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
          <svg
            className="w-10 h-10 mx-auto animate-spin"
            fill="none"
            stroke="var(--color-app-primary)"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeWidth="3"
              d="M12 2a10 10 0 100 20"
            />
          </svg>
          <p className="text-sm mt-3 text-[var(--color-app-text)]">
            তথ্য যাচাই করা হচ্ছে...
          </p>
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-4 text-sm font-medium text-[var(--color-app-muted)]"
      >
        ← শিক্ষার্থী ভিউতে ফিরে যান
      </button>
    </div>
  );
}
