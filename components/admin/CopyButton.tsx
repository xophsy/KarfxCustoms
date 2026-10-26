"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked: the number is still on screen to select by hand.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded border border-white/15 px-2 py-0.5 text-xs text-white/60 transition-colors hover:border-gold-500 hover:text-gold-500"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
