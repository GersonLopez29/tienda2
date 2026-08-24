"use client";

import { useState } from "react";
import { ShareIcon } from "@/components/icons";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={share}
      className="flex items-center gap-1.5 self-start rounded-full border border-line-strong px-3.5 py-2 text-xs font-semibold text-ink-soft hover:border-ink hover:text-ink"
    >
      <ShareIcon className="h-3.5 w-3.5" />
      {copied ? "¡Link copiado!" : "Compartir"}
    </button>
  );
}
