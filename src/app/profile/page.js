"use client";

import { useState } from "react";
import { progressData } from "../data";
import { useAuth } from "../AuthContext";

export default function ProfilePage() {
  const { role, setRole, teacherVerified, setTeacherVerified } = useAuth();
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
      <div className="flex items-center gap-3 mb-6">
        <img
          src="https://i.pravatar.cc/150?img=13"
          alt="প্রোফাইল"
          className="w-16 h-16 rounded-full ring-2"
          style={{ "--tw-ring-color": "var(--color-app-primary-soft)" }}
        />
        <div>
          <p className="font-semibold text-[var(--color-app-text)]">আপনি</p>
          <p className="text-xs text-[var(--color-app-muted)]">
            মনোভূমি শিক্ষার্থী
          </p>
        </div>
      </div>

      <div className="rounded-2xl border p-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
        <h3 className="font-[family-name:var(--font-bengali-serif)] text-base mb-3 text-[var(--color-app-text)]">
          📊 আমার অগ্রগতি
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "var(--color-app-primary-soft)" }}
          >
            <p
              className="text-lg font-bold"
              style={{ color: "var(--color-app-primary)" }}
            >
              {progressData.studyMinutesToday} মিনিট
            </p>
            <p className="text-[11px] text-[var(--color-app-muted)]">
              আজকের অধ্যয়ন
            </p>
          </div>
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "var(--color-app-accent-soft)" }}
          >
            <p
              className="text-lg font-bold"
              style={{ color: "var(--color-app-accent)" }}
            >
              🔥 {progressData.streakDays} দিন
            </p>
            <p className="text-[11px] text-[var(--color-app-muted)]">
              টানা অধ্যয়ন
            </p>
          </div>
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
                  className="h-full rounded-full"
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
        <button
          onClick={() => setRole("teacher")}
          className="w-full mt-4 py-3 rounded-full text-sm font-semibold border"
          style={{
            borderColor: "var(--color-app-primary)",
            color: "var(--color-app-primary)",
          }}
        >
          👑 আমি একজন শিক্ষক
        </button>
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

  if (teacherVerified) {
    return (
      <div className="max-w-2xl mx-auto px-4 lg:px-6 pt-6 pb-10">
        <div
          className="rounded-2xl p-6 text-center text-white mb-4"
          style={{
            background:
              "linear-gradient(135deg, var(--color-app-primary), #2a4a3f)",
          }}
        >
          <p className="text-3xl">👑</p>
          <img
            src="https://i.pravatar.cc/150?img=13"
            alt="প্রোফাইল"
            className="w-16 h-16 rounded-full ring-4 mx-auto mt-1"
            style={{ "--tw-ring-color": "var(--color-app-accent)" }}
          />
          <p className="font-[family-name:var(--font-bengali-serif)] text-lg mt-2">
            আপনি
          </p>
          <p className="text-xs text-white/80">✓ যাচাইকৃত শিক্ষক · মনোভূমি</p>
        </div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-[var(--color-app-muted)]"
        >
          ← শিক্ষার্থী ভিউতে ফিরে যান
        </button>
      </div>
    );
  }

  function sendOtp() {
    if (phone.length < 11) {
      alert("সঠিক ফোন নম্বর দিন");
      return;
    }
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setDemoOtp(code);
    alert(`ডেমো OTP: ${code}`);
    setStep(2);
  }

  function verifyOtp() {
    if (otp !== demoOtp) {
      alert("কোডটি সঠিক নয়");
      return;
    }
    setStep(3);
  }

  function submitNid() {
    if (nid.length < 5) {
      alert("সঠিক NID নম্বর দিন");
      return;
    }
    setStep(4);
    setTimeout(() => {
      setTeacherVerified(true);
    }, 1600);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 pt-6 pb-10">
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
            onClick={sendOtp}
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
            onClick={verifyOtp}
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
            onClick={submitNid}
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
