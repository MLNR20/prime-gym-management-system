import { useEffect, useRef, useState } from "react";
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
import EmptyState from "./EmptyState";
import DeleteModal from "./DeleteModal";

const DELETE_ALERT_ENTITY: Record<string, string> = {
  customers: "Customer",
  contacts: "Contact",
  attendance: "Attendance record",
  equipment: "Equipment",
  exercises: "Exercise",
  expenses: "Expense",
  inventory: "Inventory item",
  lockers: "Locker",
  sales: "Sale",
};

const GENERIC_DELETE_LABEL: Record<string, string> = {
  sales: "this sale",
  customers: "this customer",
  contacts: "this contact",
  attendance: "this attendance record",
  equipment: "this equipment",
  exercises: "this exercise",
  lockers: "this locker",
  programs: "this program",
  sessions: "this session",
};

function getDisplayLabel(row: any, url?: string): string {
  if (!row) return "";
  if (url && GENERIC_DELETE_LABEL[url]) return GENERIC_DELETE_LABEL[url];
  if (row.first_name || row.last_name) {
    return `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim();
  }
  return (
    row.exercise_name ??
    row.equipment_name ??
    row.expense_title ??
    row.item_name ??
    row.locker_number ??
    row.name ??
    row._id
  );
}

interface TableProps {
  data: any[];
  columns: any[];
  url: string;
  deleteType: string;
  buttonString?: string;
  additionalFunctionality?: (row?: any) => void;
  onEditRow?: (row: any) => void;
}

export default function CRUDTables({
  columns,
  url,
  deleteType,
  buttonString,
  additionalFunctionality,
  onEditRow,
}: TableProps): React.ReactElement {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedRowLabel, setSelectedRowLabel] = useState<string>("");
  const deleteModalRef = useRef<HTMLDialogElement>(null);
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
  const isEmpty = !loading && rowCount === 0;

  //Sessions and session history are read-only views, so they get no Actions column at all...
  const showActionButton =
    url === "customers" || url === "attendance" || url === "programs";
  const showEditDelete = url !== "sessions" && url !== "session-assignments";
  const hasActions = showActionButton || showEditDelete;

  async function deleteEntry() {
    try {
      if (deleteType === "Hard Delete")
        await deleteData({ url: url, id: selectedRow });
      if (deleteType === "Soft Delete")
        await softDeleteData({ url: url, id: selectedRow });
      deleteModalRef.current?.close();
      const entityLabel = DELETE_ALERT_ENTITY[url];
      if (entityLabel) {
        sessionStorage.setItem(
          "crudAlert",
          JSON.stringify({ message: `${entityLabel} deleted successfully!`, variant: "error" })
        );
      }
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
                  {hasActions && (
                    <th className="text-black text-[0.950rem] p-5 bg-gray-100">
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
                  columns={columns.length + (hasActions ? 1 : 0)}
                />
              ) : isEmpty ? (
                <tr>
                  <td className="p-0" colSpan={columns.length + (hasActions ? 1 : 0)}>
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
                  {hasActions && (
                    <td className="border-b border-gray-300">
                      <div className="flex gap-2 items-center">
                        {showActionButton && (
                          <button
                            className="btn btn-primary"
                            onClick={() => additionalFunctionality?.(row.original)}
                          >
                            {buttonString ?? (url === "programs" ? "Assign Exercises" : "Action")}
                          </button>
                        )}
                        {showEditDelete && (
                          <>
                            <button
                              className="btn btn-info text-white bg-blue-500"
                              onClick={() => {
                                const id = (row.original as any)._id;
                                if (onEditRow) {
                                  onEditRow(row.original);
                                  return;
                                }
                                setSelectedRow(id);
                                redirectURL(`${id}`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-error text-white"
                              onClick={() => {
                                const original = row.original as any;
                                setSelectedRow(original._id);
                                setSelectedRowLabel(getDisplayLabel(original, url));
                                deleteModalRef.current?.showModal();
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
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

      <DeleteModal
        ref={deleteModalRef}
        label={selectedRowLabel}
        onConfirm={deleteEntry} // ✅ uses selectedRow internally
      />
    </div>
  );
}
