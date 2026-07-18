type SkeletonProps = {
  className?: string;
};

export default function Skeleton({
  className = "",
}: SkeletonProps): React.ReactElement {
  return (
    <div
      className={`skeleton-flicker rounded-md ${className}`}
    />
  );
}

type TableRowsSkeletonProps = {
  rows?: number;
  columns: number;
};

export function TableRowsSkeleton({
  rows = 8,
  columns,
}: TableRowsSkeletonProps): React.ReactElement {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="odd:bg-white even:bg-gray-100 border-2 border-indigo-200 border-b-gray-300"
        >
          {Array.from({ length: columns }).map((__, colIndex) => (
            <td key={colIndex} className="border-b border-gray-300 p-5">
              <Skeleton className="h-5 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
