import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import useFetchData from "../../data/fetchData";
import createData from "../../data/createData";
import getWindowedPages from "../../utils/getWindowedPages";

export default function Assign_Sessions(): React.ReactElement {
  const customersData = useFetchData({ url: "sessions/coaching-customers" }) as any;
  const customers: any[] = Array.isArray(customersData) ? customersData : [];

  const programsData = useFetchData({ url: "programs" }) as any;
  const programs: any[] = Array.isArray(programsData) ? programsData : programsData.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [selectedProgram, setSelectedProgram] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filteredCustomers = customers.filter((c: any) =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  useEffect(() => {
    setPage(1);
  }, [searchTerm, limit]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageCustomers = filteredCustomers.slice((page - 1) * limit, page * limit);
  const pages = getWindowedPages(page, totalPages);

  function getBalance(c: any) {
    return balances[c._id] ?? c.session_balance;
  }

  async function assignSession(customerId: string) {
    const programId = selectedProgram[customerId];
    if (!programId) {
      alert("Please select a program to assign first.");
      return;
    }

    setAssigningId(customerId);
    try {
      const res = await createData({
        url: "session-assignments",
        data: { customer_id: customerId, program_id: programId },
      });
      setBalances((prev) => ({ ...prev, [customerId]: res.session_balance }));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to assign session");
    } finally {
      setAssigningId(null);
    }
  }

  return (
    <div className="flex background-white h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-6 sm:p-16 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <Header
              subheader="Assign a coaching session to customers with a coaching subscription."
              header="Assign Sessions"
            />
            <div className="flex gap-2">
              <Link className="btn btn-ghost" to="/sessions">
                Back to Sessions
              </Link>
            </div>
          </div>

          <hr className="border-t border-gray-200 mt-6" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 mb-4">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered h-10 border bg-white border-gray-400 w-full sm:w-64 text-sm"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Showing</span>
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="select select-bordered h-10 min-h-10 pr-8 border bg-white border-gray-400 text-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
          </div>

          <div className="space-y-2">
            {filteredCustomers.length === 0 && (
              <p className="text-gray-500">No coaching customers found.</p>
            )}
            {pageCustomers.map((c: any) => {
              const balance = getBalance(c);
              return (
                <div
                  key={c._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded bg-gray-50"
                >
                  <div>
                    <div className="font-medium">
                      {c.first_name} {c.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {c.subscription_type} • {balance} session{balance !== 1 ? "s" : ""} remaining
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <select
                      value={selectedProgram[c._id] || ""}
                      onChange={(e) =>
                        setSelectedProgram((prev) => ({ ...prev, [c._id]: e.target.value }))
                      }
                      disabled={balance <= 0}
                      className="select select-bordered h-10 min-h-10 border bg-white border-gray-400 text-sm w-full sm:w-56"
                    >
                      <option value="">Select a program...</option>
                      {programs.map((p: any) => (
                        <option key={p._id} value={p._id}>
                          {p.program_name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-sm btn-primary text-white w-full sm:w-auto order-last"
                      disabled={assigningId === c._id || balance <= 0 || !selectedProgram[c._id]}
                      onClick={() => assignSession(c._id)}
                    >
                      {balance <= 0
                        ? "No Sessions Left"
                        : assigningId === c._id
                        ? "Assigning..."
                        : "Assign Session"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCustomers.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-auto w-full items-center">
              <div className="flex gap-2 flex-row w-full overflow-x-auto">
                <div className="flex gap-2 justify-center items-center mx-auto sm:mx-0">
                  <button
                    className={
                      page === 1
                        ? "text-gray-400 font-normal btn bg-transparent border-none"
                        : "hover:bg-black hover:text-white btn bg-transparent border-none text-black"
                    }
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Prev
                  </button>

                  {pages.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`btn border-none ${page === p ? "btn-neutral" : "btn-outline"}`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    className={
                      page === totalPages
                        ? "text-gray-400 font-normal btn bg-transparent border-none"
                        : "hover:bg-black hover:text-white btn bg-transparent border-none text-black"
                    }
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
              <h4 className="w-full text-center sm:text-end">
                Showing {pageCustomers.length} of {totalItems} entries
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
