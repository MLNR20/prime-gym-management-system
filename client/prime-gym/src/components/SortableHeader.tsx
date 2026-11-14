import React from "react";
import type { SortOrder } from "../utils/useTableSort";

interface SortableHeaderProps {
  children: React.ReactNode;
  /** Server field this header sorts on; omit for a plain, non-sortable header. */
  field?: string;
  activeField?: string;
  order?: SortOrder;
  onSort: (field: string) => void;
}

export function getAriaSort(
  field: string | undefined,
  activeField: string | undefined,
  order: SortOrder | undefined,
): "ascending" | "descending" | "none" | undefined {
  if (!field) return undefined;
  if (field !== activeField) return "none";
  return order === "desc" ? "descending" : "ascending";
}

export default function SortableHeader({
  children,
  field,
  activeField,
  order,
  onSort,
}: SortableHeaderProps): React.ReactElement {
  if (!field) return <>{children}</>;

  const isActive = field === activeField;
  const arrow = !isActive ? "↕" : order === "desc" ? "▼" : "▲";

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-2 font-[inherit] text-left cursor-pointer select-none hover:text-indigo-600"
      title={
        !isActive
          ? "Click to sort ascending"
          : order === "desc"
            ? "Sorted descending, click for ascending"
            : "Sorted ascending, click for descending"
      }
    >
      <span>{children}</span>
      <span aria-hidden="true" className={isActive ? "text-indigo-600" : "text-gray-400"}>
        {arrow}
      </span>
    </button>
  );
}
