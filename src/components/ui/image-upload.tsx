"use client";

import { useState } from "react";
import { CldImage, CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Upload, X, Loader2, Images } from "lucide-react";
import { deleteImageAction } from "@/lib/cloudinary/cloudinary.actions";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UploadedImage = {
  publicId: string;
  url: string;
};

type BaseProps = {
  folder?: string;
  variant?: "dark" | "light";
};

type SingleProps = BaseProps & {
  multiple?: false;
  value?: string;
  publicId?: string;
  onChange: (url: string, publicId: string) => void;
  onRemove?: () => void;
};

type MultipleProps = BaseProps & {
  multiple: true;
  values?: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
};

type ImageUploadProps = SingleProps | MultipleProps;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  dark: {
    zone: "border-white/20 hover:border-white/40 bg-white/5",
    icon: "text-white/30",
    text: "text-white/40",
    subtext: "text-white/25",
  },
  light: {
    zone: "border-gray-300 hover:border-gray-400 bg-gray-50",
    icon: "text-gray-400",
    text: "text-gray-500",
    subtext: "text-gray-400",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ImageUpload(props: ImageUploadProps) {
  const { folder, variant = "light" } = props;
  const [deleting, setDeleting] = useState<string | null>(null);
  const s = styles[variant];

  const uploadFolder =
    folder ?? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER ?? "nextjs-starter";

  // ── Single mode ──────────────────────────────────────────────────────────

  if (!props.multiple) {
    const { value, publicId, onChange, onRemove } = props;

    async function handleRemove() {
      if (!publicId) {
        onRemove?.();
        return;
      }
      setDeleting(publicId);
      await deleteImageAction(publicId);
      setDeleting(null);
      onRemove?.();
    }

    function handleUploadSuccess(
      result: CloudinaryUploadWidgetResults,
      { widget }: { widget: any },
    ) {
      if (result.event !== "success" || typeof result.info !== "object") return;
      const info = result.info as { public_id: string; secure_url: string };
      // Close the widget explicitly before updating state.
      // When value changes (empty → preview), React unmounts the current CldUploadWidget
      // before onClose can fire, leaving the Cloudinary overlay in the DOM and blocking
      // all pointer events (e.g. the Save button in a modal).
      widget?.close?.();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (publicId) deleteImageAction(publicId);
      onChange(info.secure_url, info.public_id);
    }

    return (
      <div className="space-y-2">
        {value ? (
          <div className="relative inline-block">
            <div
              className="relative h-40 w-40 overflow-hidden rounded-xl border border-gray-200
                shadow-sm"
            >
              {publicId ? (
                <CldImage src={publicId} alt="Image" fill className="object-cover" sizes="160px" />
              ) : (
                // Fallback pour les URLs existantes sans publicId Cloudinary connu
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="Image" className="h-full w-full object-cover" />
              )}
            </div>
            {/* Remove */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={!!deleting}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center
                rounded-full bg-red-500 text-white shadow hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
            </button>
            {/* Replace */}
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{ folder: uploadFolder, maxFiles: 1, resourceType: "image" }}
              onSuccess={handleUploadSuccess}
              onClose={() => {
                document.body.style.overflow = "";
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="mt-2 flex items-center gap-1.5 text-xs text-gray-500
                    hover:text-gray-700"
                >
                  <Upload size={12} />
                  Changer l&apos;image
                </button>
              )}
            </CldUploadWidget>
          </div>
        ) : (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{ folder: uploadFolder, maxFiles: 1, resourceType: "image" }}
            onSuccess={handleUploadSuccess}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className={`flex h-40 w-40 flex-col items-center justify-center rounded-xl border-2
                  border-dashed transition ${s.zone}`}
              >
                <Upload size={24} className={s.icon} />
                <span className={`mt-2 text-xs ${s.text}`}>Choisir une image</span>
                <span className={`text-[10px] ${s.subtext}`}>JPG, PNG, WebP</span>
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>
    );
  }

  // ── Multiple mode ─────────────────────────────────────────────────────────

  const { values = [], onChange } = props;

  async function handleRemoveMultiple(publicId: string) {
    setDeleting(publicId);
    await deleteImageAction(publicId);
    setDeleting(null);
    onChange(values.filter((img) => img.publicId !== publicId));
  }

  function handleUploadSuccessMultiple(result: CloudinaryUploadWidgetResults) {
    if (result.event !== "success" || typeof result.info !== "object") return;
    const info = result.info as { public_id: string; secure_url: string };
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    onChange([...values, { publicId: info.public_id, url: info.secure_url }]);
  }

  return (
    <div className="space-y-3">
      {/* Grid of uploaded images */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {values.map((img) => (
            <div key={img.publicId} className="relative">
              <div
                className="relative h-32 w-32 overflow-hidden rounded-xl border border-gray-200
                  shadow-sm"
              >
                <CldImage
                  src={img.publicId}
                  alt="Image"
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMultiple(img.publicId)}
                disabled={deleting === img.publicId}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center
                  rounded-full bg-red-500 text-white shadow hover:bg-red-600 disabled:opacity-50"
              >
                {deleting === img.publicId ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <X size={12} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{ folder: uploadFolder, multiple: true, resourceType: "image" }}
        onSuccess={handleUploadSuccessMultiple}
        onClose={() => {
          document.body.style.overflow = "";
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className={`flex h-32 w-32 flex-col items-center justify-center rounded-xl border-2
            border-dashed transition ${s.zone}`}
          >
            <Images size={24} className={s.icon} />
            <span className={`mt-2 text-xs ${s.text}`}>Ajouter</span>
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
