/* eslint-disable unicorn/no-nested-ternary */
"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ReactNode } from "react";
import { AlertTriangle, RefreshCw, Trash2, X } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  error?: string;
  children?: ReactNode;
};

export function ConfirmModal({
  open,
  title = "Supprimer cet élément ?",
  description = "Cette action est irréversible. L'élément sera définitivement supprimé.",
  onCancel,
  onConfirm,
  loading,
  confirmText = "Supprimer",
  cancelText = "Annuler",
  error,
  children,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="p-0 overflow-hidden max-w-md border-0 shadow-2xl">
        <VisuallyHidden.Root>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden.Root>
        {/* Top danger band */}
        <div
          className="relative overflow-hidden bg-linear-to-br from-red-600 via-rose-600 to-red-700
            px-6 pt-6 pb-8"
        >
          <div
            className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full
              bg-white/10 blur-2xl"
          />
          <div
            className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full
              bg-rose-400/20 blur-2xl"
          />

          {/* Close button */}
          <button
            onClick={onCancel}
            disabled={loading}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-white hover:text-white
              hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" color="white" />
          </button>

          {/* Icon */}
          <div className="relative flex items-center gap-4">
            <div className="shrink-0 p-3 rounded-2xl bg-white/15 ring-1 ring-white/20 shadow-inner">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-red-200 mb-0.5">
                Action irréversible
              </p>
              <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 bg-white">
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

          {/* Warning box */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border
            border-amber-100">
            <Trash2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Une fois supprimé, cet élément ne pourra pas être restauré. Veuillez confirmer votre
              choix.
            </p>
          </div>

          {children}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-red-700 mb-0.5">
                  Échec de l&apos;opération
                </p>
                <p className="text-xs text-red-600 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm
                font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700
                text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5
                transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {error ? <RefreshCw className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
              {loading ? "Suppression..." : error ? "Réessayer" : confirmText}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
