import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import deleteData from "../data/deleteData";
import { useNavigate } from "react-router-dom";

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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const redirectURL = useNavigate();

  function deleteEntry() {
    try {
      alert(selectedRow); // alerts the id of the selected row
      deleteData({ url: url, id: selectedRow });
      const modal = document.getElementById("my_modal_5");
      if (modal instanceof HTMLDialogElement) modal.close();
    } catch (error) {
      console.error(error);
    }
  }

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
                <button className="btn btn-primary"
                  onClick={()=>{
                    const id = row.original._id;
                    setSelectedRow(id); 
                    redirectURL(`${id}`);
                  }}
                >Edit</button>
                <button
                  className="btn btn-error text-white"
                  onClick={() => {
                    const id = row.original._id;
                    console.log(id)
                    setSelectedRow(id); // ✅ store the clicked row
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

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black shadow-xl border border-gray-200">
          <h3 className="font-bold text-lg">Delete!</h3>
          <p className="py-4">
            You're about to delete <strong>{selectedRow}</strong>? This
            action cannot be reversed!
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
