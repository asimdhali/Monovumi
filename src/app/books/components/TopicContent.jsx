"use client";

export default function TopicContent({ content }) {
  return (
    <article
      className="leading-9 text-[18px]"
      dangerouslySetInnerHTML={{
        __html: content || "",
      }}
    />
  );
}
