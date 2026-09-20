import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from "@tanstack/react-table";

import { useEffect, useState } from "react";
import { useFetchDataWithStatus } from "../data/fetchData";
import getWindowedPages from "../utils/getWindowedPages";
import { TableRowsSkeleton } from "./Skeleton";
import EmptyState from "./EmptyState";
interface TableProps {
  data: any[];
  columns: any[];
  url: string;
  additionalFunctionality?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRenew?: (id: string) => void;
  onRowClick?: (row: any) => void;
  disableFetch?: boolean;
  customerId?: string;
}

export default function Tables({
  data,
  columns,
  url,
  additionalFunctionality,
  onApprove,
  onReject,
  onRenew,
  onRowClick,
  disableFetch = false,
  customerId,
}: TableProps): React.ReactElement {
  const [globalFilter, setGlobalFilter] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

 const { data: changeDataLimits, loading } = useFetchDataWithStatus({
    url: `${url}/show`,
    page,
    limit,
    search: globalFilter,
    enabled: !disableFetch,
    customerId,
  });


  const tableData = disableFetch ? data ?? [] : (changeDataLimits as any).data ?? data ?? [];
  const totalPage = disableFetch ? undefined : (changeDataLimits as any).meta?.totalPages;

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
  const isEmpty = !loading && rowCount === 0;

  return (
    <div>
      {!disableFetch && (
        <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:gap-auto w-full">
          {/*Search functionality whenever global filter is typed it changes the value and filters the value...*/}
          <div className="flex flex-row gap-3 sm:gap-5 items-center w-full sm:w-1/2">
            <h4>Search:</h4>
            <input
              type="text"
              placeholder="Search details here..."
              value={globalFilter}
              onChange={(e) => {setGlobalFilter(e.target.value);setPage(1);}}
              className="input input-bordered h-12 border bg-white border-gray-400 w-full sm:w-100"
            ></input>
          </div>
          <div className="flex flex-row items-center justify-between sm:justify-end w-full sm:w-1/2 gap-2">
            <h4>Showing</h4>
            <select
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
              className="select w-24 h-12 pr-9 border bg-white border-gray-400"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <h4>entries</h4>
          </div>
        </div>
      )}
      <div className="overflow-x-auto w-full">
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
            ) : isEmpty ? (
              <tr>
                <td className="p-0" colSpan={columns.length + (url === "admin" ? 1 : 0)}>
                  <EmptyState
                    className="w-full bg-gray-50"
                    iconClassName="bg-white text-gray-400 border border-gray-200 rounded-full"
                    title="No records found"
                    subtitle="There's nothing to show here yet."
                  />
                </td>
              </tr>
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
                      className="border-b text-nowrap text-[0.950rem] border-gray-300 py-5"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  {url === "admin" && (() => {
                    const original = (row as any).original ?? {};
                    const approvalStatus = original.approvalStatus ?? "approved";
                    const isDeactivated = !!original.isDeleted;
                    return (
                      <td className="border-b border-gray-300">
                        <div className="dropdown dropdown-end">
                          <button tabIndex={0} className="btn btn-sm btn-outline text-xs px-2">
                            Actions ▾
                          </button>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu menu-sm bg-white border rounded-lg shadow-lg z-10 w-40 p-2 gap-1"
                          >
                            {onApprove && approvalStatus !== "approved" && (
                              <li>
                                <button onClick={() => onApprove(original._id)}>Approve</button>
                              </li>
                            )}
                            {onReject && approvalStatus !== "rejected" && (
                              <li>
                                <button className="text-error" onClick={() => onReject(original._id)}>Reject</button>
                              </li>
                            )}
                            {onRenew && isDeactivated && (
                              <li>
                                <button onClick={() => onRenew(original._id)}>Renew</button>
                              </li>
                            )}
                            {!isDeactivated && (
                              <li>
                                <button className="text-error" onClick={() => additionalFunctionality?.(original._id)}>Deactivate</button>
                              </li>
                            )}
                          </ul>
                        </div>
                      </td>
                    );
                  })()}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!disableFetch && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-auto w-full items-center">
            <div className="flex gap-2 flex-row w-full overflow-x-auto">
              <div className="flex gap-2 justify-center items-center mx-auto sm:mx-0">
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
            <h4 className="w-full text-center sm:text-end">Showing {rowCount} entries</h4>
          </div>
        )}
      </div>
    </div>
  );
}
