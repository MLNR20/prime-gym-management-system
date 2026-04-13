import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

interface TableProps {
  data: any[];
  columns: any[];
}

export default function CRUDTables({
  data,
  columns,
}: TableProps): React.ReactElement {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* THEAD */}
        <thead className="bg-gray-200 p-2">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-black bg-gray-300">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
              <th className="text-black bg-gray-300">Actions</th>
            </tr>
          ))}
        </thead>

        {/* TBODY */}
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="bg-white border-2 border-indigo-200 border-b-gray-300"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-b border-gray-300">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td className="border-b flex gap-2 border-gray-300">
                <button className="btn btn-primary">Edit</button>
                <button className="btn btn-error text-white">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
