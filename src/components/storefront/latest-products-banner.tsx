"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";

const ROTATE_MS = 4000;
const MAX_ITEMS = 8;

export function LatestProductsBanner({
  products,
  onSelect,
}: {
  products: Product[];
  onSelect: (id: string) => void;
}) {
  const items = products.slice(0, MAX_ITEMS);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;
  const current = items[index];

  return (
    <div className="border-y border-line bg-surface-2">
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <span className="flex-none rounded-full bg-olive px-3 py-1 text-xs font-bold text-white">
          Recién llegado
        </span>
        <button
          type="button"
          onClick={() => onSelect(current.id)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="relative h-10 w-10 flex-none overflow-hidden rounded-lg bg-surface">
            {current.images[0] && (
              <Image src={current.images[0]} alt={current.title} fill sizes="40px" className="object-cover" />
            )}
          </div>
          <span className="min-w-0 truncate text-sm font-bold">{current.title}</span>
          <span className="fvnum flex-none text-sm font-extrabold text-olive-ink">S/ {current.price}</span>
        </button>
        {items.length > 1 && (
          <div className="flex flex-none items-center gap-1.5">
            {items.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver ${p.title}`}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-olive" : "bg-line-strong"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
