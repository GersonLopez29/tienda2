"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "kn-store-cart";

export function useCart() {
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {
      // localStorage unavailable or corrupt — start empty
    }
  }, []);

  const persist = useCallback((next: Record<string, number>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }, []);

  const update = useCallback(
    (updater: (c: Record<string, number>) => Record<string, number>) => {
      setCart((c) => persist(updater(c)));
    },
    [persist]
  );

  return { cart, updateCart: update };
}
