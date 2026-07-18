import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from "@tanstack/react-table";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchDataWithStatus } from "../data/fetchData";
import getWindowedPages from "../utils/getWindowedPages";
import { TableRowsSkeleton } from "./Skeleton";
interface TableProps {
  data: any[];
  columns: any[];
  url: string;
  additionalFunctionality?: (id: string) => void;
  onRowClick?: (row: any) => void;
}

export default function Tables({
  data,
  columns,
  url,
  additionalFunctionality,
  onRowClick,
}: TableProps): React.ReactElement {
  const navigate = useNavigate();


  const [globalFilter, setGlobalFilter] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

 const { data: changeDataLimits, loading } = useFetchDataWithStatus({
    url: `${url}/show`,
    page,
    limit,
    search: globalFilter,
  });


  const tableData = (changeDataLimits as any).data ?? data ?? [];
  const totalPage = (changeDataLimits as any).meta?.totalPages;

  useEffect(() => {
    if (typeof totalPage === "number" && totalPage > 0 && page > totalPage) {
      setPage(totalPage);
    }
  }, [page, totalPage]);

  const pages = getWindowedPages(page, Number.isFinite(totalPage) ? totalPage : 1);

  const table = useReactTable({
    data: tableData,
    columns,
    meta: {
      page,
      limit,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const rowCount = table.getRowModel().rows.length;

  return (
    <div className="overflow-x-auto mt-2">
      <div className="mb-4 flex flex-row gap-auto w-full">
        {/*Search functionality whenever global filter is typed it changes the value and filters the value...*/}
        <div className="flex flex-row gap-5  items-center w-1/2 ">
          <h4>Search:</h4>
          <input
            type="text"
            placeholder="Search details here..."
            value={globalFilter}
            onChange={(e) => {setGlobalFilter(e.target.value);setPage(1);}}
            className="input input-bordered h-12 border bg-white border-gray-400 w-100"
          ></input>
        </div>
        <div className="flex flex-row items-center justify-end  w-1/2 gap-2">
          <h4>Showing</h4>
          <select
            onChange={(e) => {
              setLimit(parseInt(e.target.value));
              setPage(1);
            }}
            className="select w-fit h-12 border bg-white border-gray-400 "
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <h4>entries</h4>
        </div>
      </div>
      <table className="table table-zebra">
        {/* THEAD */}
        <thead className="bg-slate-300 text-md">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="bg-slate-300" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-black font-bold text-[0.950rem] p-5 bg-gray-100"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}

              {url === "admin" && (
                <th className="text-black text-[0.950rem] p-5 bg-gray-100" >
                  Actions
                </th>
              )}
            </tr>
          ))}
        </thead>

        {/* TBODY */}
        <tbody>
          {loading && tableData.length === 0 ? (
            <TableRowsSkeleton
              rows={limit > 10 ? 10 : limit}
              columns={columns.length + (url === "admin" ? 1 : 0)}
            />
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.((row as any).original)}
                className={`odd:bg-white even:bg-gray-100 border-2 border-indigo-200 border-b-gray-300 ${
                  onRowClick ? "cursor-pointer hover:bg-gray-200" : ""
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b p-5 text-[0.950rem] border-gray-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {url === "admin" && (
                  <td className="border-b p-5 border-gray-300">
                  <button className="btn text-white btn-error" onClick={() => additionalFunctionality?.((row as any).original?._id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))
          )}
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
                  : "hover:bg-black hover:text-white btn bg-transparent  border-none text-black"
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
