"use client";

import { useState } from "react";
import Image from "next/image";
import { PlusIcon, TrashIcon, UploadIcon, XIcon } from "@/components/icons";
import { CATEGORY_LABEL, CONDITION_LABEL, type Product } from "@/lib/types";
import type { Category, Condition } from "@/generated/prisma/client";

export type ProductFormPayload = {
  title: string;
  brand: string;
  category: Category;
  size: string;
  condition: Condition;
  price: number;
  originalPrice: number | null;
  material: string;
  story: string;
  pairing: string;
  measurements: Record<string, number>;
  images: string[];
};

const CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];
const CONDITIONS = Object.keys(CONDITION_LABEL) as Condition[];

function measurementsToRows(m: Record<string, number>) {
  const entries = Object.entries(m);
  return entries.length ? entries.map(([label, value]) => ({ label, value: String(value) })) : [{ label: "", value: "" }];
}

export function ProductForm({
  product,
  onCancel,
  onSaved,
}: {
  product?: Product;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(product?.title ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [category, setCategory] = useState<Category>(product?.category ?? "UNISEX");
  const [size, setSize] = useState(product?.size ?? "");
  const [condition, setCondition] = useState<Condition>(product?.condition ?? "COMO_NUEVA");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [hasOffer, setHasOffer] = useState(product?.originalPrice != null);
  const [originalPrice, setOriginalPrice] = useState(
    product?.originalPrice != null ? String(product.originalPrice) : ""
  );
  const [material, setMaterial] = useState(product?.material ?? "");
  const [story, setStory] = useState(product?.story ?? "");
  const [pairing, setPairing] = useState(product?.pairing ?? "");
  const [measureRows, setMeasureRows] = useState(measurementsToRows(product?.measurements ?? {}));
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = product != null;

  const onUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files).slice(0, 6 - images.length)) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "No se pudo subir la imagen");
        setImages((prev) => [...prev, data.url as string]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url));
  const makeCoverImage = (url: string) =>
    setImages((prev) => [url, ...prev.filter((u) => u !== url)]);

  const addMeasureRow = () => setMeasureRows((rows) => [...rows, { label: "", value: "" }]);
  const removeMeasureRow = (index: number) =>
    setMeasureRows((rows) => rows.filter((_, i) => i !== index));
  const updateMeasureRow = (index: number, field: "label" | "value", value: string) =>
    setMeasureRows((rows) => rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const measurements: Record<string, number> = {};
    for (const row of measureRows) {
      if (!row.label.trim() || !row.value.trim()) continue;
      const n = Number(row.value);
      if (Number.isFinite(n) && n > 0) measurements[row.label.trim()] = n;
    }

    const payload: ProductFormPayload = {
      title: title.trim(),
      brand: brand.trim(),
      category,
      size: size.trim(),
      condition,
      price: Number(price),
      originalPrice: hasOffer && originalPrice ? Number(originalPrice) : null,
      material: material.trim(),
      story: story.trim(),
      pairing: pairing.trim(),
      measurements,
      images,
    };

    setSaving(true);
    try {
      const url = isEdit ? `/api/products/${product.id}` : "/api/products";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo guardar la prenda");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la prenda");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-line bg-surface p-6 shadow-[0_6px_20px_-6px_rgba(46,42,34,0.18)]"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-extrabold">{isEdit ? "Editar prenda" : "Nueva prenda"}</h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink-soft hover:border-ink hover:text-ink"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Título" htmlFor="title">
          <input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputCls} w-full`} />
        </Field>
        <Field label="Marca" htmlFor="brand">
          <input id="brand" required value={brand} onChange={(e) => setBrand(e.target.value)} className={`${inputCls} w-full`} />
        </Field>
        <Field label="Categoría" htmlFor="category">
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={`${inputCls} w-full`}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Talla" htmlFor="size">
          <input
            id="size"
            required
            placeholder="S, M, L…"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className={`${inputCls} w-full`}
          />
        </Field>
        <Field label="Estado de la prenda" htmlFor="condition">
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value as Condition)}
            className={`${inputCls} w-full`}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {CONDITION_LABEL[c]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Material" htmlFor="material">
          <input
            id="material"
            required
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className={`${inputCls} w-full`}
          />
        </Field>
        <Field label="Precio (S/)" htmlFor="price">
          <input
            id="price"
            type="number"
            min={1}
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`${inputCls} w-full`}
          />
        </Field>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
            <input
              type="checkbox"
              checked={hasOffer}
              onChange={(e) => setHasOffer(e.target.checked)}
              className="h-4 w-4 accent-[var(--olive)]"
            />
            Es oferta (precio original)
          </label>
          {hasOffer && (
            <input
              type="number"
              min={1}
              placeholder="Precio original"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className={`${inputCls} w-full mt-1.5`}
            />
          )}
        </div>
      </div>

      <Field label="Historia y estado" htmlFor="story" className="mt-4">
        <textarea
          id="story"
          required
          rows={2}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className={`${inputCls} w-full`}
        />
      </Field>
      <Field label="Cómo combinarla" htmlFor="pairing" className="mt-4">
        <textarea
          id="pairing"
          required
          rows={2}
          value={pairing}
          onChange={(e) => setPairing(e.target.value)}
          className={`${inputCls} w-full`}
        />
      </Field>

      <div className="mt-5">
        <span className="text-sm font-semibold">Medidas (cm)</span>
        <div className="mt-2 flex flex-col gap-2">
          {measureRows.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Largo, Pecho, Manga…"
                value={row.label}
                onChange={(e) => updateMeasureRow(i, "label", e.target.value)}
                className={`${inputCls} flex-1`}
              />
              <input
                type="number"
                min={1}
                placeholder="cm"
                value={row.value}
                onChange={(e) => updateMeasureRow(i, "value", e.target.value)}
                className={`${inputCls} w-24`}
              />
              <button
                type="button"
                onClick={() => removeMeasureRow(i)}
                aria-label="Quitar medida"
                className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-line-strong text-ink-faint hover:text-terracotta"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMeasureRow}
            className="flex w-fit items-center gap-1.5 text-sm font-bold text-olive-ink"
          >
            <PlusIcon className="h-3.5 w-3.5" /> Agregar medida
          </button>
        </div>
      </div>

      <div className="mt-5">
        <span className="text-sm font-semibold">Fotos (hasta 6)</span>
        <p className="mt-1 text-xs text-ink-faint">
          La primera foto es la portada que se ve en el catálogo. Haz clic en una foto para hacerla portada.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg bg-surface-2">
              <button
                type="button"
                onClick={() => makeCoverImage(url)}
                disabled={index === 0}
                aria-label={index === 0 ? "Portada actual" : "Hacer portada"}
                className="h-full w-full"
              >
                <Image src={url} alt="" fill sizes="80px" className="object-cover" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-ink/80 py-0.5 text-center text-[0.6rem] font-semibold text-white">
                  Portada
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(url)}
                aria-label="Quitar foto"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/80 text-white"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < 6 && (
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line-strong text-ink-faint hover:border-olive hover:text-olive-ink">
              <UploadIcon className="h-5 w-5" />
              <span className="text-[0.65rem]">{uploading ? "Subiendo…" : "Subir"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => onUpload(e.target.files)}
              />
            </label>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-terracotta-ink">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-surface hover:bg-olive disabled:opacity-60"
        >
          {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Publicar prenda"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-line-strong px-6 py-2.5 text-sm font-bold hover:border-ink"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "rounded-lg border border-line-strong bg-surface-2 px-3.5 py-2.5 text-sm outline-none focus-visible:border-olive";

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}
