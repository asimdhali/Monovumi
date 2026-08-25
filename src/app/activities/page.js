"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { subscribeToActivities } from "../services/activityService";
import { useAuth } from "../AuthContext";
const ADMIN_UID = "cPAgOCPYovRhadNXvK5uBVMfJ1I3";
function getActivityInfo(activity) {
  switch (activity.type) {
    case "topic_created":
      return {
        icon: "✨",
        label: "নতুন পোস্ট",
        color:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      };
    case "topic_updated":
      return {
        icon: "✏️",
        label: "পোস্ট আপডেট",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      };
    case "topic_minor_updated":
      return {
        icon: "🛠️",
        label: "ছোট পরিবর্তন",
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      };
    default:
      return {
        icon: "📌",
        label: "অন্যান্য",
        color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      };
  }
}
function formatTime(timestamp) {
  if (!timestamp?.toDate) {
    return "এইমাত্র";
  }
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
function isToday(timestamp) {
  if (!timestamp?.toDate) return false;
  const date = timestamp.toDate();
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
function isWithinDays(timestamp, days) {
  if (!timestamp?.toDate) return false;
  const activityDate = timestamp.toDate();
  const now = new Date();
  const difference = now.getTime() - activityDate.getTime();
  const daysDifference = difference / (1000 * 60 * 60 * 24);
  return daysDifference <= days;
}
export default function ActivitiesPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToActivities((data) => {
      setActivities(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);
  const summary = useMemo(() => {
    return {
      total: activities.length,
      todayNewPosts: activities.filter(
        (activity) =>
          activity.type === "topic_created" && isToday(activity.createdAt),
      ).length,
      todayMajorEdits: activities.filter(
        (activity) =>
          activity.type === "topic_updated" && isToday(activity.createdAt),
      ).length,
      todayMinorEdits: activities.filter(
        (activity) =>
          activity.type === "topic_minor_updated" &&
          isToday(activity.createdAt),
      ).length,
    };
  }, [activities]);
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (activityFilter !== "all" && activity.type !== activityFilter) {
        return false;
      }
      if (timeFilter === "today" && !isToday(activity.createdAt)) {
        return false;
      }
      if (timeFilter === "week" && !isWithinDays(activity.createdAt, 7)) {
        return false;
      }
      if (timeFilter === "month" && !isWithinDays(activity.createdAt, 30)) {
        return false;
      }
      if (!searchQuery.trim()) {
        return true;
      }
      const searchText = [
        activity.actorName,
        activity.actorEmail,
        activity.title,
        activity.subject,
        activity.metadata?.paperTitle,
        activity.metadata?.chapter,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchText.includes(searchQuery.toLowerCase());
    });
  }, [activities, searchQuery, activityFilter, timeFilter]);
  if (!user) {
    return (
      <main className="min-h-screen px-4 py-12">
        {" "}
        <div className="mx-auto max-w-xl text-center"> লগইন প্রয়োজন। </div>{" "}
      </main>
    );
  }
  if (user.uid !== ADMIN_UID) {
    return (
      <main className="min-h-screen px-4 py-12">
        {" "}
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950">
          {" "}
          <div className="text-5xl">🔒</div>{" "}
          <h1 className="mt-4 text-xl font-bold"> অনুমতি নেই </h1>{" "}
          <p className="mt-2 text-sm text-gray-500">
            {" "}
            এই পেজটি শুধুমাত্র Administrator-এর জন্য।{" "}
          </p>{" "}
        </div>{" "}
      </main>
    );
  }
  return (
    <main className="min-h-screen px-3 py-6 sm:px-5">
      {" "}
      <div className="mx-auto max-w-6xl">
        {" "}
        {/* Header */}{" "}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {" "}
          <div>
            {" "}
            <h1 className="text-2xl font-bold sm:text-3xl">
              {" "}
              Activity Dashboard{" "}
            </h1>{" "}
            <p className="mt-1 text-sm text-gray-500">
              {" "}
              Monovumi-তে সকল গুরুত্বপূর্ণ কার্যক্রম{" "}
            </p>{" "}
          </div>{" "}
          <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium dark:bg-gray-800">
            {" "}
            মোট {activities.length} টি Activity{" "}
          </div>{" "}
        </div>{" "}
        {/* Summary Cards */}{" "}
        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {" "}
          <div className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-950">
            {" "}
            <div className="text-2xl">📊</div>{" "}
            <p className="mt-3 text-sm text-gray-500"> মোট Activity </p>{" "}
            <p className="mt-1 text-2xl font-bold"> {summary.total} </p>{" "}
          </div>{" "}
          <div className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-950">
            {" "}
            <div className="text-2xl">✨</div>{" "}
            <p className="mt-3 text-sm text-gray-500"> আজ নতুন পোস্ট </p>{" "}
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {" "}
              {summary.todayNewPosts}{" "}
            </p>{" "}
          </div>{" "}
          <div className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-950">
            {" "}
            <div className="text-2xl">✏️</div>{" "}
            <p className="mt-3 text-sm text-gray-500"> আজ Major Edit </p>{" "}
            <p className="mt-1 text-2xl font-bold text-blue-600">
              {" "}
              {summary.todayMajorEdits}{" "}
            </p>{" "}
          </div>{" "}
          <div className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-950">
            {" "}
            <div className="text-2xl">🛠️</div>{" "}
            <p className="mt-3 text-sm text-gray-500"> আজ Minor Edit </p>{" "}
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {" "}
              {summary.todayMinorEdits}{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Search and Filters */}{" "}
        <div className="mb-6 rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-950">
          {" "}
          <div className="grid gap-3 lg:grid-cols-3">
            {" "}
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="নাম, ইমেইল বা পোস্ট খুঁজুন..."
              className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />{" "}
            <select
              value={activityFilter}
              onChange={(event) => setActivityFilter(event.target.value)}
              className="rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              {" "}
              <option value="all"> সব Activity </option>{" "}
              <option value="topic_created"> ✨ নতুন পোস্ট </option>{" "}
              <option value="topic_updated"> ✏️ পোস্ট আপডেট </option>{" "}
              <option value="topic_minor_updated">
                {" "}
                🛠️ ছোট পরিবর্তন{" "}
              </option>{" "}
            </select>{" "}
            <select
              value={timeFilter}
              onChange={(event) => setTimeFilter(event.target.value)}
              className="rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              {" "}
              <option value="all"> সব সময় </option>{" "}
              <option value="today"> আজ </option>{" "}
              <option value="week"> গত ৭ দিন </option>{" "}
              <option value="month"> গত ৩০ দিন </option>{" "}
            </select>{" "}
          </div>{" "}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            {" "}
            <span>
              {" "}
              পাওয়া গেছে {filteredActivities.length} টি Activity{" "}
            </span>{" "}
            {(searchQuery ||
              activityFilter !== "all" ||
              timeFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActivityFilter("all");
                  setTimeFilter("all");
                }}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {" "}
                Filter Reset{" "}
              </button>
            )}{" "}
          </div>{" "}
        </div>{" "}
        {/* Loading */}{" "}
        {loading && (
          <div className="py-20 text-center text-gray-500">
            {" "}
            Activity লোড হচ্ছে...{" "}
          </div>
        )}{" "}
        {/* Empty */}{" "}
        {!loading && filteredActivities.length === 0 && (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            {" "}
            <div className="text-5xl"> 📭 </div>{" "}
            <h2 className="mt-4 text-lg font-semibold">
              {" "}
              কোনো Activity পাওয়া যায়নি{" "}
            </h2>{" "}
            <p className="mt-2 text-sm text-gray-500">
              {" "}
              Search বা Filter পরিবর্তন করে আবার চেষ্টা করুন।{" "}
            </p>{" "}
          </div>
        )}{" "}
        {/* Activity List */}{" "}
        <div className="space-y-3">
          {" "}
          {filteredActivities.map((activity) => {
            const info = getActivityInfo(activity);
            let topicLink = "";
            if (activity.subject && activity.paperId && activity.targetId) {
              const encodedSubject = encodeURIComponent(activity.subject);
              topicLink = `/books/${encodedSubject}/${activity.paperId}/${activity.targetId}`;
            }
            return (
              <div
                key={activity.id}
                className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-gray-950"
              >
                {" "}
                <div className="flex gap-3">
                  {" "}
                  {/* Avatar */}{" "}
                  <div className="flex-shrink-0">
                    {" "}
                    {activity.actorPhotoURL ? (
                      <img
                        src={activity.actorPhotoURL}
                        alt={activity.actorName || "User"}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-lg dark:bg-gray-800">
                        {" "}
                        👤{" "}
                      </div>
                    )}{" "}
                  </div>{" "}
                  {/* Content */}{" "}
                  <div className="min-w-0 flex-1">
                    {" "}
                    <div className="flex flex-wrap items-center gap-2">
                      {" "}
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${info.color}`}
                      >
                        {" "}
                        {info.icon} {info.label}{" "}
                      </span>{" "}
                      <span className="text-xs text-gray-500">
                        {" "}
                        {formatTime(activity.createdAt)}{" "}
                      </span>{" "}
                    </div>{" "}
                    <div className="mt-2">
                      {" "}
                      <p className="font-semibold">
                        {" "}
                        {activity.actorName ||
                          activity.actorEmail ||
                          "অজানা ব্যবহারকারী"}{" "}
                      </p>{" "}
                      {activity.actorEmail && (
                        <p className="text-xs text-gray-500">
                          {" "}
                          {activity.actorEmail}{" "}
                        </p>
                      )}{" "}
                    </div>{" "}
                    <div className="mt-3">
                      {" "}
                      <p className="font-medium">
                        {" "}
                        {activity.title || "নামবিহীন পোস্ট"}{" "}
                      </p>{" "}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {" "}
                        {activity.subject && (
                          <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-800">
                            {" "}
                            📚 {activity.subject}{" "}
                          </span>
                        )}{" "}
                        {activity.metadata?.paperTitle && (
                          <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-800">
                            {" "}
                            📖 {activity.metadata.paperTitle}{" "}
                          </span>
                        )}{" "}
                        {activity.metadata?.chapter && (
                          <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-800">
                            {" "}
                            📑 {activity.metadata.chapter}{" "}
                          </span>
                        )}{" "}
                      </div>{" "}
                    </div>{" "}
                    {topicLink && (
                      <Link
                        href={topicLink}
                        className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {" "}
                        পোস্ট দেখুন →{" "}
                      </Link>
                    )}{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            );
          })}{" "}
        </div>{" "}
      </div>{" "}
    </main>
  );
}
