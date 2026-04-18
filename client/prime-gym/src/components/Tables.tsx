import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { useState } from "react";

interface TableProps {
  data: any[];
  columns: any[];
}

export default function Tables({
  data,
  columns,
}: TableProps): React.ReactElement {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="overflow-x-auto mt-6">
      <div className="mb-4 flex flex-row gap-auto w-full">
        {/*Search functionality whenever global filter is typed it changes the value and filters the value...*/}
        <div className="flex flex-row gap-5  items-center w-1/2 ">
          <h4>Search:</h4>
          <input
            type="text"
            placeholder="Search details here..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="input input-bordered h-12 border bg-white border-gray-400 w-100"
          ></input>
        </div>
      </div>
      <table className="table table-zebra">
        {/* THEAD */}
        <thead className="bg-blue-200 text-md">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
