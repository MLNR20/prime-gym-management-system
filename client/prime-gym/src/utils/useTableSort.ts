import { useCallback, useState } from "react";

export type SortOrder = "asc" | "desc";

export interface SortState {
  sortBy?: string;
  sortOrder?: SortOrder;
}

/**
 * The server field a column sorts on, or undefined when it cannot be sorted.
 * - accessorKey columns sort on that field.
 * - Computed columns (accessorFn, e.g. "Full Name") opt in with meta.sortField.
 * - Columns whose value is added after the database query opt out with meta.sortable = false.
 */
export function getSortField(columnDef: any): string | undefined {
  if (columnDef?.meta?.sortable === false) return undefined;
  return columnDef?.meta?.sortField ?? columnDef?.accessorKey;
}

/** Click a new column to sort it ascending; click the active column to flip asc <-> desc. */
export default function useTableSort() {
  const [sort, setSort] = useState<SortState>({});

  const toggleSort = useCallback((field: string) => {
    setSort((current) =>
      current.sortBy === field
        ? { sortBy: field, sortOrder: current.sortOrder === "asc" ? "desc" : "asc" }
        : { sortBy: field, sortOrder: "asc" },
    );
  }, []);

  return { sort, toggleSort };
}
