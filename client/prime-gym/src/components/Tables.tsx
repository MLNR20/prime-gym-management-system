import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { useState } from "react";
import useFetchData from "../data/fetchData";
import getWindowedPages from "../utils/getWindowedPages";
interface TableProps {
  data: any[];
  columns: any[];
  url: string;
}

export default function Tables({
  data,
  columns,
  url,
}: TableProps): React.ReactElement {
  const [globalFilter, setGlobalFilter] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const changeDataLimits = useFetchData({
    url: `${url}/show/?page=${page}&limit=${limit}`,
  });
console.log("BASE URL:", `${url}/show/?page=${page}&limit=${limit}`);
  const tableData = (changeDataLimits as any).data ?? data ?? [];
  const totalPage = (changeDataLimits as any).meta?.totalPages;
  const pages = getWindowedPages(page, totalPage ?? 1);

  console.log(changeDataLimits)
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  const rowCount = table.getRowModel().rows.length;

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
      <div className="mt-6 flex flex-row gap-auto w-full">
        <div className="flex gap-2 flex-row gap-auto w-full">
          <div className="flex gap-2 justify-center items-center">
            {/* Prev */}
            <button
              className={
                page === 1
                  ? "text-gray-400 font-normal btn bg-transparent border-none"
                  : "hover:bg-black hover:text-white bg-gray-200 btn bg-transparent  border-none text-black"
              }
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>

            {/* Page numbers */}
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`btn border-none ${page === p ? "btn-neutral" : "btn-outline"}`}
              >
                {p}
              </button>
            ))}

            {/* Next */}
            <button
              className={
                page === totalPage
                  ? "text-gray-400 font-normal btn bg-transparent border-none"
                  : "hover:bg-black hover:text-white  btn bg-transparent border-none text-black"
              }
              disabled={page === totalPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
        <h4 className="w-full text-end">Showing {rowCount} entries</h4>
      </div>
    </div>
  );
}
