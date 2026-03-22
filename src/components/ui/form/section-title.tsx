export function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
      <div className="text-gray-400">{icon}</div>
      <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
    </div>
  );
}
