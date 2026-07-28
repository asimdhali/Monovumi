"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import EditorToolbar from "./EditorToolbar";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),

      Heading.configure({
        levels: [1, 2, 3],
      }),

      Underline,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "লেখা এখান থেকে শুরু করুন...",
      }),
    ],

    content: value,

    immediatelyRender: false,

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-[var(--color-app-border)] overflow-hidden">
      <EditorToolbar editor={editor} />
      <div className="max-w-4xl mx-auto p-1">
        <div
          className="
      rounded-2xl
      border-2
      border-dashed
      border-[var(--color-app-border)]
      min-h-[430px]
      px-1
      py-1
      transition-all
      hover:border-[var(--color-app-primary)]
    "
        >
          <EditorContent
            editor={editor}
            className="
      editor-wrapper
      min-h-[340px]
      max-w-full
      mx-auto
      px-1
      py-1
"
          />
        </div>
      </div>
    </div>
  );
}
