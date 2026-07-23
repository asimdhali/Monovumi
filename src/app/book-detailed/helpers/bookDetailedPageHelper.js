import React from "react";

export function toBengaliNum(n) {
  const digits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(n)
    .split("")
    .map((d) => digits[parseInt(d, 10)])
    .join("")
    .padStart(2, "০");
}
