"use client";

import { useState } from "react";
import { MessageIcon, XIcon } from "@/components/icons";

export function SuggestionButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, contact: contact || undefined }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setMessage("");
      setContact("");
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
      }, 1800);
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar sugerencias" : "Enviar sugerencia"}
        className="fixed bottom-5 right-5 z-[80] flex h-12 w-12 items-center justify-center rounded-full bg-[#3f6c4b] text-white shadow-lg hover:brightness-95"
      >
        {open ? <XIcon className="h-5 w-5" /> : <MessageIcon className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-[80] w-[calc(100vw-2.5rem)] max-w-[320px] rounded-2xl border border-line-strong bg-surface p-4 shadow-xl">
          {status === "sent" ? (
            <p className="py-4 text-center text-sm font-semibold text-ink">¡Gracias por tu sugerencia!</p>
          ) : (
            <>
              <p className="mb-2 text-sm font-bold">¿Alguna sugerencia?</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntanos qué podemos mejorar..."
                rows={4}
                maxLength={500}
                className="w-full resize-none rounded-xl border border-line bg-surface-2 p-2.5 text-sm outline-none focus:border-line-strong"
              />
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Tu correo o WhatsApp (opcional)"
                maxLength={120}
                className="mt-2 w-full rounded-xl border border-line bg-surface-2 p-2.5 text-sm outline-none focus:border-line-strong"
              />
              {status === "error" && (
                <p className="mt-1.5 text-xs text-terracotta">No se pudo enviar. Intenta de nuevo.</p>
              )}
              <button
                type="button"
                onClick={submit}
                disabled={message.trim().length < 5 || status === "sending"}
                className="mt-2.5 w-full rounded-full bg-[#3f6c4b] py-2.5 text-sm font-bold text-white hover:brightness-95 disabled:opacity-50"
              >
                {status === "sending" ? "Enviando…" : "Enviar"}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
