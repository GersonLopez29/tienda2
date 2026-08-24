"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewForm({
  sellerId,
  initialRating,
  initialComment,
}: {
  sellerId: string;
  initialRating: number;
  initialComment: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(initialRating || 5);
  const [comment, setComment] = useState(initialComment);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, rating, comment }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "No se pudo guardar tu reseña");
        return;
      }
      setSaved(true);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface-2 p-4">
      <p className="text-xs font-bold tracking-wide text-ink-faint uppercase">
        {initialComment ? "Edita tu reseña" : "Deja tu reseña de este vendedor"}
      </p>
      <div className="flex gap-1 text-2xl">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n} estrellas`}
            className={n <= rating ? "text-mustard" : "text-line-strong hover:text-mustard"}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="¿Cómo fue tu experiencia con este vendedor?"
        rows={2}
        maxLength={500}
        className="w-full rounded-xl border border-line-strong bg-surface px-3 py-2 text-sm outline-none focus-visible:border-olive"
      />
      {error && <p className="text-xs text-terracotta">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="self-start rounded-full bg-ink px-4 py-2 text-xs font-bold text-surface hover:bg-olive disabled:opacity-60"
      >
        {saving ? "Guardando…" : saved ? "¡Guardado! Actualizar" : "Publicar reseña"}
      </button>
    </form>
  );
}
