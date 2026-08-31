"use client";
import { useState, useRef, useEffect } from "react";
export default function TableMenu({ editor }) {
  const [open, setOpen] = useState(false);
  const [showInsertDialog, setShowInsertDialog] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setShowInsertDialog(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);
  if (!editor) return null;
  const inTable = editor.isActive("table");
  function closeMenu() {
    setOpen(false);
    setShowInsertDialog(false);
  }
  function runCommand(command) {
    command();
    closeMenu();
  }
  function insertTable() {
    const rows = Math.min(20, Math.max(1, Number(tableRows) || 1));
    const cols = Math.min(20, Math.max(1, Number(tableCols) || 1));
    const success = editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    if (success) {
      closeMenu();
    }
  }
  return (
    <div ref={menuRef} className="relative flex-shrink-0">
      {" "}
      {/* Main Table Button */}{" "}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setOpen((prev) => !prev);
          setShowInsertDialog(false);
        }}
        className=" flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[15px] hover:bg-[var(--color-app-primary-soft)] transition "
        title="Table"
        aria-label="Table"
      >
        {" "}
        🟦{" "}
      </button>{" "}
      {open && (
        <div className=" fixed right-3 sm:right-4 top-[108px] z-[99999] w-[calc(100vw-24px)] max-w-[520px] rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] shadow-2xl overflow-hidden ">
          {" "}
          {/* ================= HEADER ================= */}{" "}
          <div className=" flex items-center justify-between px-4 py-3 border-b border-[var(--color-app-border)] ">
            {" "}
            <div className="flex items-center gap-2.5">
              {" "}
              <div className=" w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--color-app-primary-soft)] text-sm ">
                {" "}
                🟦{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="text-[13px] font-bold text-[var(--color-app-text)]">
                  {" "}
                  Table{" "}
                </p>{" "}
                <p className="text-[10px] text-[var(--color-app-muted)]">
                  {" "}
                  টেবিল তৈরি ও সম্পাদনা{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={closeMenu}
              className=" w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-app-muted)] hover:bg-[var(--color-app-primary-soft)] transition "
              aria-label="Close"
            >
              {" "}
              ×{" "}
            </button>{" "}
          </div>{" "}
          {/* ================= INSERT TABLE ================= */}{" "}
          {!showInsertDialog ? (
            <div className="p-3">
              {" "}
              <ToolbarSection title="Table">
                {" "}
                <ToolbarButton
                  icon="＋"
                  label="Insert Table"
                  onClick={() => setShowInsertDialog(true)}
                  wide
                />{" "}
              </ToolbarSection>{" "}
              {/* ================= ROW / COLUMN ================= */}{" "}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {" "}
                <ToolbarGroup title="Row">
                  {" "}
                  <ToolbarButton
                    icon="↑"
                    label="Above"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor.chain().focus().addRowBefore().run(),
                      )
                    }
                  />{" "}
                  <ToolbarButton
                    icon="↓"
                    label="Below"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor.chain().focus().addRowAfter().run(),
                      )
                    }
                  />{" "}
                </ToolbarGroup>{" "}
                <ToolbarGroup title="Column">
                  {" "}
                  <ToolbarButton
                    icon="←"
                    label="Left"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor.chain().focus().addColumnBefore().run(),
                      )
                    }
                  />{" "}
                  <ToolbarButton
                    icon="→"
                    label="Right"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor.chain().focus().addColumnAfter().run(),
                      )
                    }
                  />{" "}
                </ToolbarGroup>{" "}
              </div>{" "}
              {/* ================= CELL / HEADER ================= */}{" "}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {" "}
                <ToolbarGroup title="Cell">
                  {" "}
                  <ToolbarButton
                    icon="🔗"
                    label="Merge"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor.chain().focus().mergeCells().run(),
                      )
                    }
                  />{" "}
                  <ToolbarButton
                    icon="✂"
                    label="Split"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() => editor.chain().focus().splitCell().run())
                    }
                  />{" "}
                  <ToolbarButton
                    icon="▣"
                    label="Header Cell"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor.chain().focus().toggleHeaderCell().run(),
                      )
                    }
                  />{" "}
                </ToolbarGroup>{" "}
                <ToolbarGroup title="Header">
                  {" "}
                  <ToolbarButton
                    icon="↕"
                    label="Header Row"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor.chain().focus().toggleHeaderRow().run(),
                      )
                    }
                  />{" "}
                  <ToolbarButton
                    icon="↔"
                    label="Header Column"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor.chain().focus().toggleHeaderColumn().run(),
                      )
                    }
                  />{" "}
                </ToolbarGroup>{" "}
              </div>{" "}
              {/* ================= DELETE ================= */}{" "}
              <ToolbarSection title="Delete" className="mt-3">
                {" "}
                <div className="grid grid-cols-3 gap-1.5">
                  {" "}
                  <ToolbarButton
                    icon="⌫"
                    label="Row"
                    danger
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() => editor.chain().focus().deleteRow().run())
                    }
                  />{" "}
                  <ToolbarButton
                    icon="⌫"
                    label="Column"
                    danger
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor.chain().focus().deleteColumn().run(),
                      )
                    }
                  />{" "}
                  <ToolbarButton
                    icon="🗑"
                    label="Table"
                    danger
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor.chain().focus().deleteTable().run(),
                      )
                    }
                  />{" "}
                </div>{" "}
              </ToolbarSection>{" "}
              {/* ================= COLORS ================= */}{" "}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {" "}
                <ColorGroup title="Cell Color">
                  {" "}
                  <ColorButton
                    color="transparent"
                    border="var(--color-app-border)"
                    title="None"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor
                          .chain()
                          .focus()
                          .updateAttributes("tableCell", {
                            backgroundColor: null,
                          })
                          .updateAttributes("tableHeader", {
                            backgroundColor: null,
                          })
                          .run(),
                      )
                    }
                  />{" "}
                  <ColorButton
                    color="#20364d"
                    title="Green"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor
                          .chain()
                          .focus()
                          .updateAttributes("tableCell", {
                            backgroundColor: "#20364d",
                          })
                          .updateAttributes("tableHeader", {
                            backgroundColor: "#20364d",
                          })
                          .run(),
                      )
                    }
                  />{" "}
                  <ColorButton
                    color="#2196F3"
                    title="Blue"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor
                          .chain()
                          .focus()
                          .updateAttributes("tableCell", {
                            backgroundColor: "#2196F3",
                          })
                          .updateAttributes("tableHeader", {
                            backgroundColor: "#2196F3",
                          })
                          .run(),
                      )
                    }
                  />{" "}
                  <ColorButton
                    color="#4b4217"
                    title="Yellow"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor
                          .chain()
                          .focus()
                          .updateAttributes("tableCell", {
                            backgroundColor: "#4b4217",
                          })
                          .run(),
                      )
                    }
                  />{" "}
                  <ColorButton
                    color="#39254b"
                    title="Purple"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor
                          .chain()
                          .focus()
                          .updateAttributes("tableCell", {
                            backgroundColor: "#39254b",
                          })
                          .run(),
                      )
                    }
                  />{" "}
                  <ColorButton
                    color="#512626"
                    title="Red"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor
                          .chain()
                          .focus()
                          .updateAttributes("tableCell", {
                            backgroundColor: "#512626",
                          })
                          .run(),
                      )
                    }
                  />{" "}
                </ColorGroup>{" "}
                <ColorGroup title="Border Color">
                  {" "}
                  <ColorButton
                    color="transparent"
                    border="var(--color-app-border)"
                    title="Default"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor
                          .chain()
                          .focus()
                          .updateAttributes("tableCell", { borderColor: null })
                          .updateAttributes("tableHeader", {
                            borderColor: null,
                          })
                          .run(),
                      )
                    }
                  />{" "}
                  <ColorButton
                    color="#4CAF50"
                    title="Green"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor
                          .chain()
                          .focus()
                          .updateAttributes("tableCell", {
                            borderColor: "#4CAF50",
                          })
                          .updateAttributes("tableHeader", {
                            borderColor: "#4CAF50",
                          })
                          .run(),
                      )
                    }
                  />{" "}
                  <ColorButton
                    color="#2196F3"
                    title="Blue"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor
                          .chain()
                          .focus()
                          .updateAttributes("tableCell", {
                            borderColor: "#2196F3",
                          })
                          .updateAttributes("tableHeader", {
                            borderColor: "#2196F3",
                          })
                          .run(),
                      )
                    }
                  />{" "}
                  <ColorButton
                    color="#FFC107"
                    title="Yellow"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor
                          .chain()
                          .focus()
                          .updateAttributes("tableCell", {
                            borderColor: "#FFC107",
                          })
                          .run(),
                      )
                    }
                  />{" "}
                  <ColorButton
                    color="#F44336"
                    title="Red"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor
                          .chain()
                          .focus()
                          .updateAttributes("tableCell", {
                            borderColor: "#F44336",
                          })
                          .run(),
                      )
                    }
                  />{" "}
                  <ColorButton
                    color="#000000"
                    title="Black"
                    disabled={!inTable}
                    onClick={() =>
                      runCommand(() =>
                        editor
                          .chain()
                          .focus()
                          .updateAttributes("tableCell", {
                            borderColor: "#000000",
                          })
                          .updateAttributes("tableHeader", {
                            borderColor: "#000000",
                          })
                          .run(),
                      )
                    }
                  />{" "}
                </ColorGroup>{" "}
              </div>{" "}
            </div>
          ) : (
            /* ================= INSERT TABLE PANEL ================= */ <div className="p-4">
              {" "}
              <div className="flex items-center gap-2.5 mb-4">
                {" "}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowInsertDialog(false)}
                  className=" w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)] transition "
                >
                  {" "}
                  ←{" "}
                </button>{" "}
                <div>
                  {" "}
                  <p className="text-[13px] font-bold text-[var(--color-app-text)]">
                    {" "}
                    Insert Table{" "}
                  </p>{" "}
                  <p className="text-[10px] text-[var(--color-app-muted)]">
                    {" "}
                    টেবিলের আকার নির্বাচন করুন{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              {/* Size Inputs */}{" "}
              <div className="grid grid-cols-2 gap-3">
                {" "}
                <NumberField
                  label="Rows"
                  value={tableRows}
                  onChange={setTableRows}
                />{" "}
                <NumberField
                  label="Columns"
                  value={tableCols}
                  onChange={setTableCols}
                />{" "}
              </div>{" "}
              {/* Visual Preview */}{" "}
              <div className=" mt-4 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-bg)] p-4 ">
                {" "}
                <div className="flex justify-center">
                  {" "}
                  <TablePreview rows={tableRows} cols={tableCols} />{" "}
                </div>{" "}
                <p className="text-center text-[10px] text-[var(--color-app-muted)] mt-3">
                  {" "}
                  {Math.min(20, Math.max(1, Number(tableRows) || 1))} {" × "}{" "}
                  {Math.min(20, Math.max(1, Number(tableCols) || 1))}{" "}
                  {" Table"}{" "}
                </p>{" "}
              </div>{" "}
              {/* Insert Button */}{" "}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={insertTable}
                className=" w-full mt-4 rounded-xl bg-[var(--color-app-primary)] hover:opacity-90 py-2.5 text-white text-[12px] font-bold transition "
              >
                {" "}
                Insert Table{" "}
              </button>{" "}
            </div>
          )}{" "}
        </div>
      )}{" "}
    </div>
  );
}
/* ========================================================= Toolbar Section ========================================================= */ function ToolbarSection({
  title,
  children,
  className = "",
}) {
  return (
    <div className={className}>
      {" "}
      <p className=" px-1 mb-1.5 text-[9px] font-bold uppercase tracking-wider text-[var(--color-app-muted)] ">
        {" "}
        {title}{" "}
      </p>{" "}
      {children}{" "}
    </div>
  );
}
/* ========================================================= Toolbar Group ========================================================= */ function ToolbarGroup({
  title,
  children,
}) {
  return (
    <div className=" rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-bg)] p-1 ">
      {" "}
      <p className=" px-2 pt-1 pb-0.5 text-[9px] font-bold text-[var(--color-app-muted)] ">
        {" "}
        {title}{" "}
      </p>{" "}
      <div className="grid grid-cols-2 gap-0.5"> {children} </div>{" "}
    </div>
  );
}
/* ========================================================= Toolbar Button ========================================================= */ function ToolbarButton({
  icon,
  label,
  onClick,
  danger = false,
  disabled = false,
  wide = false,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={` ${wide ? "justify-center" : "justify-start"} flex items-center gap-2 ${wide ? "w-full" : "w-full"} min-w-0 px-2.5 py-2 rounded-lg text-[11px] font-medium transition ${danger ? "text-red-500 hover:bg-red-500/10" : "text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)]"} disabled:opacity-35 disabled:pointer-events-none `}
    >
      {" "}
      <span className="w-5 text-center flex-shrink-0 text-[13px]">
        {" "}
        {icon}{" "}
      </span>{" "}
      <span className="truncate"> {label} </span>{" "}
    </button>
  );
}
/* ========================================================= Color Group ========================================================= */ function ColorGroup({
  title,
  children,
}) {
  return (
    <div className=" rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-bg)] px-2.5 py-2 ">
      {" "}
      <p className=" text-[9px] font-bold text-[var(--color-app-muted)] mb-2 ">
        {" "}
        {title}{" "}
      </p>{" "}
      <div className="flex items-center gap-2 flex-wrap"> {children} </div>{" "}
    </div>
  );
}
/* ========================================================= Color Button ========================================================= */ function ColorButton({
  color,
  border,
  title,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className=" w-7 h-7 rounded-full border flex-shrink-0 flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-30 disabled:pointer-events-none "
      style={{ backgroundColor: color, borderColor: border || color }}
    >
      {" "}
      {color === "transparent" && (
        <span className="text-[10px] text-[var(--color-app-muted)]"> × </span>
      )}{" "}
    </button>
  );
}
/* ========================================================= Number Field ========================================================= */ function NumberField({
  label,
  value,
  onChange,
}) {
  return (
    <div>
      {" "}
      <label className=" block text-[10px] font-semibold text-[var(--color-app-muted)] mb-1.5 ">
        {" "}
        {label}{" "}
      </label>{" "}
      <input
        type="number"
        min={1}
        max={20}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className=" w-full rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-bg)] px-3 py-2.5 text-sm text-[var(--color-app-text)] outline-none focus:border-[var(--color-app-primary)] "
      />{" "}
    </div>
  );
}
/* ========================================================= Table Preview ========================================================= */ function TablePreview({
  rows,
  cols,
}) {
  const safeRows = Math.min(8, Math.max(1, Number(rows) || 1));
  const safeCols = Math.min(10, Math.max(1, Number(cols) || 1));
  return (
    <div
      className="grid gap-0.5"
      style={{ gridTemplateColumns: `repeat(${safeCols}, 22px)` }}
    >
      {" "}
      {Array.from({ length: safeRows * safeCols }).map((_, index) => {
        const row = Math.floor(index / safeCols);
        return (
          <div
            key={index}
            className={` w-[22px] h-[16px] rounded-[2px] border border-[var(--color-app-border)] ${row === 0 ? "bg-[var(--color-app-primary-soft)]" : "bg-[var(--color-app-surface)]"} `}
          />
        );
      })}{" "}
    </div>
  );
}
