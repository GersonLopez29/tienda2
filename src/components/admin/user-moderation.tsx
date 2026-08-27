"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";

type ModeratedUser = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  role: string;
  isBlocked: boolean;
  emailVerified: boolean;
  createdAt: Date;
};

export function UserModeration({ users, currentUserId }: { users: ModeratedUser[]; currentUserId: string }) {
  const router = useRouter();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ModeratedUser | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const toggleBlocked = async (user: ModeratedUser) => {
    setTogglingId(user.id);
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      });
      router.refresh();
    } finally {
      setTogglingId(null);
    }
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setDeleteConfirmText("");
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleteConfirmText !== deleteTarget.name) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setDeleteError(body?.error ?? "No se pudo eliminar el usuario");
        return;
      }
      closeDeleteModal();
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="bg-bg">
      <AdminHeader title="Moderación de usuarios" />

      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
        <h2 className="mb-6 text-xl font-extrabold">Usuarios ({users.length})</h2>
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 truncate text-sm font-bold">
                  {user.name}
                  {user.role === "admin" && (
                    <span className="flex-none rounded-full bg-olive px-2 py-0.5 text-[0.65rem] font-bold text-white">
                      Admin
                    </span>
                  )}
                  {!user.emailVerified && (
                    <span className="flex-none rounded-full bg-surface-2 px-2 py-0.5 text-[0.65rem] text-ink-faint">
                      Sin verificar
                    </span>
                  )}
                  {user.isBlocked && (
                    <span className="flex-none rounded-full bg-terracotta px-2 py-0.5 text-[0.65rem] font-bold text-white">
                      Bloqueado
                    </span>
                  )}
                </p>
                <p className="text-xs text-ink-faint">
                  {user.email} · {user.whatsapp}
                </p>
              </div>
              {user.id !== currentUserId && (
                <div className="flex flex-none items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBlocked(user)}
                    disabled={togglingId === user.id}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-60 ${
                      user.isBlocked
                        ? "border-olive text-olive-ink hover:bg-olive-wash"
                        : "border-line-strong text-ink-soft hover:border-terracotta hover:text-terracotta"
                    }`}
                  >
                    {user.isBlocked ? "Desbloquear" : "Bloquear"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(user)}
                    className="rounded-full border border-line-strong px-4 py-2 text-sm font-semibold text-ink-soft hover:border-terracotta hover:text-terracotta"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6">
            <h3 className="text-lg font-extrabold">Eliminar usuario</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Esta acción es permanente y no se puede deshacer. Escribe{" "}
              <span className="font-bold">{deleteTarget.name}</span> para confirmar.
            </p>
            <input
              autoFocus
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="mt-4 w-full rounded-xl border border-line-strong bg-bg px-3 py-2 text-sm"
              placeholder={deleteTarget.name}
            />
            {deleteError && <p className="mt-2 text-sm text-terracotta">{deleteError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-full border border-line-strong px-4 py-2 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting || deleteConfirmText !== deleteTarget.name}
                className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                {deleting ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
