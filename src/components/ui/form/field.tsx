const variants = {
  dark: {
    label: "text-xs font-medium text-white/50 uppercase tracking-wider",
    icon: "absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none",
    error: "text-xs text-red-400",
  },
  light: {
    label: "text-xs font-semibold text-gray-500 uppercase tracking-wider",
    icon: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none",
    error: "text-xs text-red-500",
  },
};

export function Field({
  label,
  error,
  icon,
  action,
  required = true,
  variant = "dark",
  children,
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  required?: boolean;
  variant?: "dark" | "light";
  children: React.ReactNode;
}) {
  const v = variants[variant];

  return (
    <div className="space-y-1.5">
      <label className={v.label}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {icon && <div className={v.icon}>{icon}</div>}
        {children}
        {action && <div className="absolute right-3 top-1/2 -translate-y-1/2">{action}</div>}
      </div>
      {error && <p className={v.error}>{error}</p>}
    </div>
  );
}
