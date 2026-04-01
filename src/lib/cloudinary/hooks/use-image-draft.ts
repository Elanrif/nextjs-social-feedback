/* eslint-disable unicorn/no-nested-ternary */
"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { extractPublicId } from "@/lib/cloudinary/cloudinary.utils";

type ImageDraft = { url: string; publicId: string };

type UseImageDraftOptions = {
  /**
   * Clé localStorage — unique par formulaire et champ.
   * Convention : "{entité}:{champ}:{id|new}"
   * @example "profile:avatar" | "product:image:42" | "product:image:new"
   */
  storageKey: string;
  /** URL initiale depuis le serveur (ex: entity.imageUrl). */
  initialUrl?: string | null;
};

type UseImageDraftReturn = {
  /** URL de l'image (draft ou serveur). */
  url: string;
  /** public_id Cloudinary correspondant. */
  publicId: string;
  /** À passer à <ImageUpload onChange={...} /> */
  handleChange: (url: string, publicId: string) => void;
  /** À passer à <ImageUpload onRemove={...} /> — vide l'état et le draft. */
  handleRemove: () => void;
  /** À appeler après une sauvegarde réussie — supprime le draft localStorage. */
  clearDraft: () => void;
};

function notifyChange(storageKey: string) {
  window.dispatchEvent(new CustomEvent(`ls:${storageKey}`));
}

/**
 * Hook générique pour gérer un upload d'image avec persistance localStorage.
 *
 * Utilise useSyncExternalStore pour éviter les problèmes d'hydratation SSR
 * et les setState synchrones dans useEffect.
 * - getServerSnapshot → null  (server et hydration initiale identiques)
 * - getSnapshot       → lit localStorage (après hydration)
 *
 * @example — profil utilisateur
 * const avatar = useImageDraft({ storageKey: "profile:avatar", initialUrl: user.avatarUrl });
 * <ImageUpload value={avatar.url} publicId={avatar.publicId}
 *   onChange={avatar.handleChange} onRemove={avatar.handleRemove} />
 * // Dans onSubmit après succès :
 * avatar.clearDraft();
 *
 * @example — création produit
 * const image = useImageDraft({ storageKey: "product:image:new" });
 *
 * @example — édition produit
 * const image = useImageDraft({ storageKey: `product:image:${product.id}`, initialUrl: product.imageUrl });
 */
export function useImageDraft({
  storageKey,
  initialUrl,
}: UseImageDraftOptions): UseImageDraftReturn {
  // Cache the last snapshot by raw string — useSyncExternalStore compares by reference,
  // so returning a new object each call causes an infinite loop.
  const snapshotCache = useRef<{ raw: string; parsed: ImageDraft } | null>(null);

  const subscribe = useCallback(
    (callback: () => void) => {
      window.addEventListener("storage", callback);
      window.addEventListener(`ls:${storageKey}`, callback);
      return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(`ls:${storageKey}`, callback);
      };
    },
    [storageKey],
  );

  const getSnapshot = useCallback((): ImageDraft | null => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    if (snapshotCache.current?.raw === raw) return snapshotCache.current.parsed;
    try {
      const parsed = JSON.parse(raw) as ImageDraft;
      snapshotCache.current = { raw, parsed };
      return parsed;
    } catch {
      localStorage.removeItem(storageKey);
      return null;
    }
  }, [storageKey]);

  const draft = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => null, // server snapshot — identique au server HTML, pas de mismatch
  );

  const draftIsValid = !!draft?.url && draft.url !== initialUrl;
  const url = draftIsValid ? draft.url : (initialUrl ?? "");
  const publicId = draftIsValid ? draft.publicId : initialUrl ? extractPublicId(initialUrl) : "";

  function handleChange(newUrl: string, newPublicId: string) {
    localStorage.setItem(storageKey, JSON.stringify({ url: newUrl, publicId: newPublicId }));
    notifyChange(storageKey);
  }

  function handleRemove() {
    localStorage.removeItem(storageKey);
    notifyChange(storageKey);
  }

  function clearDraft() {
    localStorage.removeItem(storageKey);
    notifyChange(storageKey);
  }

  return { url, publicId, handleChange, handleRemove, clearDraft };
}
