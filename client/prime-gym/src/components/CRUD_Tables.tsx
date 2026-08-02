import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import deleteData from "../data/deleteData";
import { useNavigate } from "react-router-dom";
import { useFetchDataWithStatus } from "../data/fetchData";
import getWindowedPages from "../utils/getWindowedPages";
import softDeleteData from "../data/softDeleteData";
import { TableRowsSkeleton } from "./Skeleton";

interface TableProps {
  data: any[];
  columns: any[];
  url: string;
  deleteType: string;
  buttonString?: string;
  additionalFunctionality?: (row?: any) => void;
}

export default function CRUDTables({
  columns,
  url,
  deleteType,
  buttonString,
  additionalFunctionality,
}: TableProps): React.ReactElement {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  //This line of code is responsible for search functionality...
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: changeDataLimits, loading } = useFetchDataWithStatus({
    url: `${url}/show`,
    page,
    limit,
    search: globalFilter,
  });

  const tableData = changeDataLimits.data ?? [];
  const totalPage = changeDataLimits.meta?.totalPages;

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

  const redirectURL = useNavigate();
  const rowCount = table.getRowModel().rows.length;

  async function deleteEntry() {
    try {
      if (deleteType === "Hard Delete")
        await deleteData({ url: url, id: selectedRow });
      if (deleteType === "Soft Delete")
        await softDeleteData({ url: url, id: selectedRow });
      const modal = document.getElementById("my_modal_5");
      if (modal instanceof HTMLDialogElement) modal.close();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:gap-auto w-full">
        {/*Search functionality whenever global filter is typed it changes the value and filters the value...*/}
        <div className="flex flex-row gap-3 sm:gap-5 items-center w-full sm:w-1/2">
          <h4>Search:</h4>
          <input
            type="text"
            placeholder="Search details here..."
            value={globalFilter}
            onChange={(e) => { setGlobalFilter(e.target.value); setPage(1); }}
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
      <div className="overflow-x-auto w-full">
        <table className="table table-zebra">
          {/* THEAD */}
          <thead className="bg-gray-200 p-2">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-black text-[0.950rem] p-5 bg-gray-100"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </th>
                ))}
                <th className="text-black text-[0.950rem] p-5 bg-gray-100">
                  Actions
                </th>
              </tr>
            ))}
          </thead>

          {/* TBODY */}
          <tbody>
            {loading && tableData.length === 0 ? (
              <TableRowsSkeleton
                rows={limit > 10 ? 10 : limit}
                columns={columns.length + 1}
              />
            ) : (
              table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="odd:bg-white even:bg-gray-100 border-2 text-[0.950rem] p-5 border-indigo-200 border-b-gray-300"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b text-nowrap border-gray-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="border-b  flex gap-2 border-gray-300">
                  {(url === "customers" || url === "attendance" || url === "programs") && (
                    <button
                      className="btn btn-primary"
                      onClick={() => additionalFunctionality?.(row.original)}
                    >
                      {buttonString ?? (url === "programs" ? "Assign Exercises" : "Action")}
                    </button>
                  )}
                  {url !== "sessions" && (
                    <>
                      <button
                        className="btn btn-info text-white bg-blue-500"
                        onClick={() => {
                          const id = (row.original as any)._id;
                          setSelectedRow(id);
                          redirectURL(`${id}`);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-error text-white"
                        onClick={() => {
                          const id = (row.original as any)._id;
                          console.log(id);
                          setSelectedRow(id);
                          const modal = document.getElementById("my_modal_5");
                          if (modal instanceof HTMLDialogElement) modal.showModal();
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-auto w-full items-center">
          <div className="flex gap-2 flex-row w-full overflow-x-auto">
            <div className="flex gap-2 justify-center items-center mx-auto sm:mx-0">
              {/* Prev */}
              <button
                className={
                  page === 1
                    ? "text-gray-400 font-normal btn bg-transparent border-none"
                    : "hover:bg-black hover:text-white bg-transparent btn   border-none text-black"
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
      </div>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black shadow-xl border border-gray-200">
          <h3 className="font-bold text-lg">Delete!</h3>
          <p className="py-4">
            You're about to delete <strong>{selectedRow}</strong>? This action
            cannot be reversed!
          </p>

          <div className="modal-action gap-2">
            <button
              className="btn btn-error text-white"
              onClick={deleteEntry} // ✅ uses selectedRow internally
            >
              Delete
            </button>
            <form method="dialog">
              <button className="btn btn-neutral btn-outline">Close</button>
            </form>
          </div>
        </div>

        {/* backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
