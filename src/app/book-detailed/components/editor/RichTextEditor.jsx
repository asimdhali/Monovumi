"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import EditorToolbar from "./EditorToolbar";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";

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

      <EditorContent
        editor={editor}
        className="ProseMirror min-h-[250px] p-4 focus:outline-none"
      />
    </div>
  );
}
