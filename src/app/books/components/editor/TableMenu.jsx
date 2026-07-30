"use client";

import { useState, useRef, useEffect } from "react";

export default function TableMenu({ editor }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const menuItems = [
    {
      section: "Table",
      items: [
        {
          label: "🟦 Insert Table",
          action: () =>
            editor
              .chain()
              .focus()
              .insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
              })
              .run(),
        },
      ],
    },

    {
      section: "Row",
      items: [
        {
          label: "⬆ Add Row Above",
          action: () => editor.chain().focus().addRowBefore().run(),
        },
        {
          label: "⬇ Add Row Below",
          action: () => editor.chain().focus().addRowAfter().run(),
        },
      ],
    },

    {
      section: "Column",
      items: [
        {
          label: "⬅ Add Column Left",
          action: () => editor.chain().focus().addColumnBefore().run(),
        },
        {
          label: "➡ Add Column Right",
          action: () => editor.chain().focus().addColumnAfter().run(),
        },
      ],
    },
    {
      section: "Delete",

      items: [
        {
          label: "🗑 Delete Row",

          action: () => editor.chain().focus().deleteRow().run(),
        },

        {
          label: "🗑 Delete Column",

          action: () => editor.chain().focus().deleteColumn().run(),
        },

        {
          label: "🗑 Delete Table",

          action: () => editor.chain().focus().deleteTable().run(),
        },
      ],
    },
    {
      section: "Cell",

      items: [
        {
          label: "🔗 Merge Cells",

          action: () => editor.chain().focus().mergeCells().run(),
        },

        {
          label: "✂ Split Cell",

          action: () => editor.chain().focus().splitCell().run(),
        },

        {
          label: "🧾 Toggle Header Cell",

          action: () => editor.chain().focus().toggleHeaderCell().run(),
        },
      ],
    },
    {
      section: "Header",

      items: [
        {
          label: "⬆ Toggle Header Row",

          action: () => editor.chain().focus().toggleHeaderRow().run(),
        },

        {
          label: "⬅ Toggle Header Column",

          action: () => editor.chain().focus().toggleHeaderColumn().run(),
        },
      ],
    },
    {
      section: "Cell Color",

      items: [
        {
          label: "⬜ None",
          action: () =>
            editor
              .chain()
              .focus()
              .updateAttributes("tableCell", {
                backgroundColor: null,
              })
              .run(),
        },

        {
          label: "🟢 Green",
          action: () =>
            editor
              .chain()
              .focus()
              .updateAttributes("tableCell", {
                backgroundColor: "#233124",
              })
              .run(),
        },

        {
          label: "🔵 Blue",
          action: () =>
            editor
              .chain()
              .focus()
              .updateAttributes("tableCell", {
                backgroundColor: "#20364d",
              })
              .run(),
        },

        {
          label: "🟡 Yellow",
          action: () =>
            editor
              .chain()
              .focus()
              .updateAttributes("tableCell", {
                backgroundColor: "#4b4217",
              })
              .run(),
        },

        {
          label: "🟣 Purple",
          action: () =>
            editor
              .chain()
              .focus()
              .updateAttributes("tableCell", {
                backgroundColor: "#39254b",
              })
              .run(),
        },

        {
          label: "🔴 Red",
          action: () =>
            editor
              .chain()
              .focus()
              .updateAttributes("tableCell", {
                backgroundColor: "#512626",
              })
              .run(),
        },
      ],
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-lg hover:bg-[var(--color-app-primary-soft)] transition "
        title="Table"
      >
        🟦
      </button>

      {open && (
        <div
          className="
      absolute
      right-0
      top-full
      mt-2
      w-72
      rounded-xl
      border
      border-[var(--color-app-border)]
      bg-[var(--color-app-surface)]
      shadow-2xl
      z-[999]
      overflow-hidden
    "
        >
          <>
            <div
              className="
      bg-[var(--color-app-surface)]
      border-b
      border-[var(--color-app-border)]
"
            >
              <button
                className="w-full px-4 py-4 text-left hover:bg-[var(--color-app-primary-soft)]"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .insertTable({
                      rows: 3,
                      cols: 3,
                      withHeaderRow: true,
                    })
                    .run();

                  setOpen(false);
                }}
              >
                🟦 Insert Table
              </button>
            </div>

            <div
              className="
      table-menu-scroll
      max-h-[340px]
      overflow-y-auto
      overscroll-contain
    "
            >
              {menuItems.slice(1).map((group, index) => (
                <div key={group.section}>
                  {index !== 0 && (
                    <div className="border-t border-[var(--color-app-border)]" />
                  )}

                  <div className="px-4 py-2 text-xs font-semibold text-[var(--color-app-muted)]">
                    {group.section}
                  </div>

                  {group.items.map((item) => (
                    <button
                      key={item.label}
                      className="w-full text-left px-4 py-3 hover:bg-[var(--color-app-primary-soft)] transition"
                      onClick={() => {
                        item.action();
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </>
        </div>
      )}
    </div>
  );
}
