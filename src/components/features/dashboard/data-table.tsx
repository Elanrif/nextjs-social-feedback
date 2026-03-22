import { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
};

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  emptyText = "Aucune donnée.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase
                  tracking-wider ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key as string} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded-full animate-pulse w-3/4" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center">
                  <p className="text-sm text-gray-400">{emptyText}</p>
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.key as string}
                      className={`px-5 py-3.5 text-sm text-gray-700 ${col.className || ""}`}
                    >
                      {col.render ? col.render(row) : (row[col.key as keyof T] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
