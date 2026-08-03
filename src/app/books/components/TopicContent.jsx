"use client";

export default function TopicContent({ content }) {
  console.log("VIEW HTML =", content);

  return (
    <article
      className="post-content leading-9 text-[18px]"
      dangerouslySetInnerHTML={{
        __html: content || "",
      }}
    />
  );
}
