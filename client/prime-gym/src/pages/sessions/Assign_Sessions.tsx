import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import useFetchData from "../../data/fetchData";
import createData from "../../data/createData";

export default function Assign_Sessions(): React.ReactElement {
  const customersData = useFetchData({ url: "sessions/coaching-customers" }) as any;
  const customers: any[] = Array.isArray(customersData) ? customersData : [];

  const programsData = useFetchData({ url: "programs" }) as any;
  const programs: any[] = Array.isArray(programsData) ? programsData : programsData.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [selectedProgram, setSelectedProgram] = useState<Record<string, string>>({});

  const filteredCustomers = customers.filter((c: any) =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <div className="flex items-start justify-between">
            <Header
              subheader="Assign a coaching session to customers with a coaching subscription."
              header="Assign Sessions"
            />
            <div className="flex gap-2">
              <Link className="btn btn-ghost" to="/sessions/history">
                Assignment History
              </Link>
              <Link className="btn btn-ghost" to="/sessions">
                Back to Sessions
              </Link>
            </div>
          </div>

          <hr className="border-t border-gray-200 mt-6" />

          <div className="flex flex-wrap gap-2 mt-6 mb-4">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered h-10 border bg-white border-gray-400 w-64 text-sm"
            />
          </div>

          <div className="space-y-2">
            {filteredCustomers.length === 0 && (
              <p className="text-gray-500">No coaching customers found.</p>
            )}
            {filteredCustomers.map((c: any) => {
              const balance = getBalance(c);
              return (
                <div
                  key={c._id}
                  className="flex items-center justify-between p-3 border rounded bg-gray-50"
                >
                  <div>
                    <div className="font-medium">
                      {c.first_name} {c.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {c.subscription_type} • {balance} session{balance !== 1 ? "s" : ""} remaining
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedProgram[c._id] || ""}
                      onChange={(e) =>
                        setSelectedProgram((prev) => ({ ...prev, [c._id]: e.target.value }))
                      }
                      disabled={balance <= 0}
                      className="select select-bordered h-10 min-h-10 border bg-white border-gray-400 text-sm w-56"
                    >
                      <option value="">Select a program...</option>
                      {programs.map((p: any) => (
                        <option key={p._id} value={p._id}>
                          {p.program_name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-sm btn-primary text-white"
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
        </div>
      </div>
    </div>
  );
}
