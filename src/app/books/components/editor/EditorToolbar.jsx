"use client";
import TableMenu from "./TableMenu";

export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div
      className="
    sticky
    top-0
    z-20
    flex
    items-center
    gap-2
    border-b
    border-[var(--color-app-border)]
    px-3
    py-2
    bg-[var(--color-app-surface)]
  "
    >
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
        className="rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-2 py-1 text-sm"
      >
        <option value="p">P</option>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
      </select>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`w-9 h-9 rounded-lg transition ${
          editor.isActive("bold")
            ? "bg-[var(--color-app-primary)] text-white"
            : "hover:bg-[var(--color-app-primary-soft)]"
        }`}
      >
        <strong>B</strong>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`w-9 h-9 rounded-lg transition ${
          editor.isActive("italic")
            ? "bg-[var(--color-app-primary)] text-white"
            : "hover:bg-[var(--color-app-primary-soft)]"
        }`}
      >
        <em>I</em>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`w-9 h-9 rounded-lg transition ${
          editor.isActive("underline")
            ? "bg-[var(--color-app-primary)] text-white"
            : "hover:bg-[var(--color-app-primary-soft)]"
        }`}
      >
        <u>U</u>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`w-9 h-9 rounded-lg transition ${
          editor.isActive("bulletList")
            ? "bg-[var(--color-app-primary)] text-white"
            : "hover:bg-[var(--color-app-primary-soft)]"
        }`}
      >
        ••
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`w-9 h-9 rounded-lg transition ${
          editor.isActive("orderedList")
            ? "bg-[var(--color-app-primary)] text-white"
            : "hover:bg-[var(--color-app-primary-soft)]"
        }`}
      >
        1.
      </button>
      {/* Left */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`w-9 h-9 rounded-lg transition ${
          editor.isActive({ textAlign: "left" })
            ? "bg-[var(--color-app-primary)] text-white"
            : "hover:bg-[var(--color-app-primary-soft)]"
        }`}
        title="Left"
      >
        ⬅
      </button>

      {/* Center */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`w-9 h-9 rounded-lg transition ${
          editor.isActive({ textAlign: "center" })
            ? "bg-[var(--color-app-primary)] text-white"
            : "hover:bg-[var(--color-app-primary-soft)]"
        }`}
        title="Center"
      >
        ⬌
      </button>

      {/* Right */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`w-9 h-9 rounded-lg transition ${
          editor.isActive({ textAlign: "right" })
            ? "bg-[var(--color-app-primary)] text-white"
            : "hover:bg-[var(--color-app-primary-soft)]"
        }`}
        title="Right"
      >
        ➡
      </button>

      {/* Justify */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`w-9 h-9 rounded-lg transition ${
          editor.isActive({ textAlign: "justify" })
            ? "bg-[var(--color-app-primary)] text-white"
            : "hover:bg-[var(--color-app-primary-soft)]"
        }`}
        title="Justify"
      >
        ☰
      </button>
      <TableMenu editor={editor} />
    </div>
  );
}
