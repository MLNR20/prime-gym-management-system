import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import deleteData from "../data/deleteData";
import { useNavigate } from "react-router-dom";
import useFetchData from "../data/fetchData";
interface TableProps {
  data: any[];
  columns: any[];
  url: string;
}

export default function CRUDTables({
  data,
  columns,
  url,
}: TableProps): React.ReactElement {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  //This line of code is responsible for search functionality...
  const [globalFilter, setGlobalFilter] = useState("");

  const changeDataLimits = useFetchData({
    url: `${url}/show/?page=${page}&limit=${limit}`,
  });

  const tableData = (changeDataLimits as any).data ?? data ?? [];
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

  const redirectURL = useNavigate();
  const rowCount = table.getRowModel().rows.length;

  function deleteEntry() {
    try {
      alert(selectedRow);
      deleteData({ url: url, id: selectedRow });
      const modal = document.getElementById("my_modal_5");
      if (modal instanceof HTMLDialogElement) modal.close();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
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
        <div className="flex flex-row items-center justify-end  w-1/2 gap-2">
          <h4>Showing</h4>
          <select
            onChange={(e) => setLimit(parseInt(e.target.value))}
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
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const id = row.original._id;
                      setSelectedRow(id);
                      redirectURL(`${id}`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error text-white"
                    onClick={() => {
                      const id = row.original._id;
                      console.log(id);
                      setSelectedRow(id); 
                      const modal = document.getElementById("my_modal_5");
                      if (modal instanceof HTMLDialogElement) modal.showModal();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6">
          <h4>Showing {rowCount} entries</h4>
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
