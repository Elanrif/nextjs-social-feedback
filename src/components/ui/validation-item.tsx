import { Check, Circle } from "lucide-react";

export default function ValidationItem({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {valid ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Circle className="h-4 w-4 text-gray-300" />
      )}
      <span className={valid ? "text-emerald-600" : "text-gray-400"}>{text}</span>
    </div>
  );
}
