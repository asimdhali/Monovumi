"use client";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
  Palette,
  Highlighter,
} from "lucide-react";

import TableMenu from "./TableMenu";

export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  const buttonClass = (active = false) =>
    `
    flex-shrink-0
    w-8 h-8
    rounded-md
    flex
    items-center
    justify-center
    transition-all
    duration-150
    ${
      active
        ? "bg-[var(--color-app-primary)] text-white"
        : "text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)]"
    }
  `;

  return (
    <div
      className="
        sticky
        top-0
        z-20
        flex
        items-center
        gap-1
        overflow-x-auto
        whitespace-nowrap
        border-b
        border-[var(--color-app-border)]
        px-2
        py-1.5
        bg-[var(--color-app-surface)]
        scrollbar-none
      "
    >
      {/* Paragraph / Heading */}
      <div className="flex-shrink-0">
        <select
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
                ? "h2"
                : editor.isActive("heading", { level: 3 })
                  ? "h3"
                  : "p"
          }
          onChange={(e) => {
            const value = e.target.value;

            if (value === "p") {
              editor.chain().focus().setParagraph().run();
            }

            if (value === "h1") {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }

            if (value === "h2") {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }

            if (value === "h3") {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }
          }}
          className="
            h-8
            rounded-md
            border
            border-[var(--color-app-border)]
            bg-[var(--color-app-surface)]
            px-2
            text-xs
            font-medium
            text-[var(--color-app-text)]
            outline-none
          "
          title="লেখার ধরন"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-[var(--color-app-border)] mx-1" />

      {/* Bold */}
      <button
        type="button"
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
      >
        <Bold size={17} strokeWidth={2.5} />
      </button>

      {/* Italic */}
      <button
        type="button"
        title="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
      >
        <Italic size={17} />
      </button>

      {/* Underline */}
      <button
        type="button"
        title="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive("underline"))}
      >
        <Underline size={17} />
      </button>

      {/* Strike */}
      <button
        type="button"
        title="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive("strike"))}
      >
        <Strikethrough size={17} />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-[var(--color-app-border)] mx-1" />

      {/* Bullet list */}
      <button
        type="button"
        title="Bullet List"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
      >
        <List size={18} />
      </button>

      {/* Ordered list */}
      <button
        type="button"
        title="Numbered List"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
      >
        <ListOrdered size={18} />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-[var(--color-app-border)] mx-1" />

      {/* Align left */}
      <button
        type="button"
        title="বামে সাজান"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={buttonClass(editor.isActive({ textAlign: "left" }))}
      >
        <AlignLeft size={17} />
      </button>

      {/* Align center */}
      <button
        type="button"
        title="মাঝখানে সাজান"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={buttonClass(editor.isActive({ textAlign: "center" }))}
      >
        <AlignCenter size={17} />
      </button>

      {/* Align right */}
      <button
        type="button"
        title="ডানে সাজান"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={buttonClass(editor.isActive({ textAlign: "right" }))}
      >
        <AlignRight size={17} />
      </button>

      {/* Justify */}
      <button
        type="button"
        title="সমানভাবে সাজান"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={buttonClass(editor.isActive({ textAlign: "justify" }))}
      >
        <AlignJustify size={17} />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-[var(--color-app-border)] mx-1" />

      {/* Undo */}
      <button
        type="button"
        title="Undo"
        disabled={!editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
        className="
          flex-shrink-0
          w-8 h-8
          rounded-md
          flex
          items-center
          justify-center
          text-[var(--color-app-text)]
          hover:bg-[var(--color-app-primary-soft)]
          disabled:opacity-30
          disabled:cursor-not-allowed
          transition
        "
      >
        <Undo2 size={17} />
      </button>

      {/* Redo */}
      <button
        type="button"
        title="Redo"
        disabled={!editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
        className="
          flex-shrink-0
          w-8 h-8
          rounded-md
          flex
          items-center
          justify-center
          text-[var(--color-app-text)]
          hover:bg-[var(--color-app-primary-soft)]
          disabled:opacity-30
          disabled:cursor-not-allowed
          transition
        "
      >
        <Redo2 size={17} />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-[var(--color-app-border)] mx-1" />

      {/* Text Color */}
      <button
        type="button"
        title="লেখার রং"
        className="
          flex-shrink-0
          w-8 h-8
          rounded-md
          flex
          items-center
          justify-center
          hover:bg-[var(--color-app-primary-soft)]
          transition
        "
      >
        <Palette size={17} />
      </button>

      {/* Highlight */}
      <button
        type="button"
        title="Highlight"
        className="
          flex-shrink-0
          w-8 h-8
          rounded-md
          flex
          items-center
          justify-center
          hover:bg-[var(--color-app-primary-soft)]
          transition
        "
      >
        <Highlighter size={17} />
      </button>

      {/* Table */}
      <div className="flex-shrink-0">
        <TableMenu editor={editor} />
      </div>
    </div>
  );
}
