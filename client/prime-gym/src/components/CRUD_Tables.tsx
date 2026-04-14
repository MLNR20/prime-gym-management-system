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

  function deleteEntry() {}

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
                <button
                  className="btn btn-error text-white"
                  onClick={() => {
                    const modal = document.getElementById("my_modal_5");

                    if (modal instanceof HTMLDialogElement) {
                      modal.showModal();
                    }
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
            You're about to delete a record! You won't be able to reverse this!
          </p>

          <div className="modal-action">
            <form method="dialog gap-2">
              <button className="btn btn-error text-white">Delete</button>
              <button className="btn bg-gray-200 text-black border-none hover:bg-gray-300">
                Close
              </button>
            </form>
          </div>
        </div>

        {/* softer backdrop */}
        <form method="dialog" className="modal-backdrop bg-black/40">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
