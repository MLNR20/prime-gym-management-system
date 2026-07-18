import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import useFetchData from "../../data/fetchData";

export default function Program_Manage(): React.ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState<any>(null);
  const [assigned, setAssigned] = useState<any[]>([]);
  const exercisesData = useFetchData({ url: "exercises" }) as any;
  const allExercises: any[] = Array.isArray(exercisesData) ? exercisesData : exercisesData.data || [];
  const [loading, setLoading] = useState(false);

  const [assignedCustomers, setAssignedCustomers] = useState<any[]>([]);
  const customersData = useFetchData({ url: "customers" }) as any;
  const allCustomers: any[] = Array.isArray(customersData) ? customersData : customersData.data || [];
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTargetArea, setSelectedTargetArea] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await fetch(`http://localhost:3002/programs/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (res.ok) {
          const json = await res.json();
          setProgram(json);
        }

        const a = await fetch(`http://localhost:3002/programs/${id}/exercises`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (a.ok) {
          const arr = await a.json();
          setAssigned(arr || []);
        }

        const c = await fetch(`http://localhost:3002/programs/${id}/customers`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (c.ok) {
          const arr = await c.json();
          setAssignedCustomers(arr || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id]);

  async function assignExercise(exId: string) {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3002/programs/${id}/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ exercise_id: exId }),
      });
      if (res.ok) {
        const assignedRes = await fetch(`http://localhost:3002/programs/${id}/exercises`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const arr = await assignedRes.json();
        setAssigned(arr || []);
      } else {
        console.error("failed to assign");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function unassignExercise(exId: string) {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3002/programs/${id}/exercises/${exId}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        const assignedRes = await fetch(`http://localhost:3002/programs/${id}/exercises`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const arr = await assignedRes.json();
        setAssigned(arr || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function assignCustomer(customerId: string) {
    if (!id) return;
    setCustomerLoading(true);
    try {
      const res = await fetch(`http://localhost:3002/programs/${id}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ customer_id: customerId }),
      });
      if (res.ok) {
        const assignedRes = await fetch(`http://localhost:3002/programs/${id}/customers`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const arr = await assignedRes.json();
        setAssignedCustomers(arr || []);
      } else {
        console.error("failed to assign customer");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCustomerLoading(false);
    }
  }

  async function unassignCustomer(customerId: string) {
    if (!id) return;
    setCustomerLoading(true);
    try {
      const res = await fetch(`http://localhost:3002/programs/${id}/customers/${customerId}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        const assignedRes = await fetch(`http://localhost:3002/programs/${id}/customers`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const arr = await assignedRes.json();
        setAssignedCustomers(arr || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCustomerLoading(false);
    }
  }

  const assignedIds = assigned.map((a) => String(a._id));
  const assignedCustomerIds = assignedCustomers.map((c) => String(c._id));

  const filteredCustomers = allCustomers.filter((c: any) =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );

  // Dynamically collect unique target areas from the available exercises list
  const targetAreas = Array.from(
    new Set(allExercises.map((ex: any) => ex.target_area).filter(Boolean))
  ).sort() as string[];

  // Filter logic
  const filteredExercises = allExercises.filter((ex: any) => {
    const matchesSearch = ex.exercise_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedTargetArea ? ex.target_area === selectedTargetArea : true;
    return matchesSearch && matchesArea;
  });

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <div className="flex items-start justify-between">
            <Header subheader="Manage program exercises" header={program ? program.program_name : "Program"} />
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-10">
            {/* Left Column: Assigned Exercises */}
            <div>
              <h3 className="font-semibold mb-2">Assigned Exercises ({assigned.length})</h3>
              <div className="space-y-2">
                {assigned.length === 0 && <p className="text-gray-500">No exercises assigned.</p>}
                {assigned.map((ex: any) => (
                  <div key={ex._id} className="flex items-center justify-between p-3 border rounded bg-gray-50">
                    <div>
                      <div className="font-medium">{ex.exercise_name}</div>
                      <div className="text-sm text-gray-500">{ex.target_area} • {ex.reps} reps • {ex.sets} sets</div>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline" disabled={loading} onClick={() => unassignExercise(String(ex._id))}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Available Exercises with Filter Options */}
            <div>
              <h3 className="font-semibold mb-2">Available Exercises</h3>

              {/* Filters Container */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered h-10 border bg-white border-gray-400 flex-1 text-sm"
                />
                <select
                  value={selectedTargetArea}
                  onChange={(e) => setSelectedTargetArea(e.target.value)}
                  className="select select-bordered h-10 min-h-10 border bg-white border-gray-400 text-sm w-44"
                >
                  <option value="">All Areas</option>
                  {targetAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 max-h-96 overflow-auto border p-2 rounded">
                {filteredExercises.length === 0 && (
                  <p className="text-gray-500 p-2">No exercises found.</p>
                )}
                {filteredExercises.map((ex: any) => (
                  <div key={ex._id} className="flex items-center justify-between p-3 border rounded bg-gray-50">
                    <div>
                      <div className="font-medium">{ex.exercise_name}</div>
                      <div className="text-sm text-gray-500">{ex.target_area} • {ex.reps} reps • {ex.sets} sets</div>
                    </div>
                    <div>
                      {assignedIds.includes(String(ex._id)) ? (
                        <button className="btn btn-sm btn-disabled">Assigned</button>
                      ) : (
                        <button className="btn btn-sm btn-primary text-white" disabled={loading} onClick={() => assignExercise(String(ex._id))}>
                          Assign
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-200 my-8" />

          <h2 className="font-semibold text-lg mb-4">Assign Program to Customers</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column: Assigned Customers */}
            <div>
              <h3 className="font-semibold mb-2">Assigned Customers ({assignedCustomers.length})</h3>
              <div className="space-y-2">
                {assignedCustomers.length === 0 && <p className="text-gray-500">No customers assigned yet.</p>}
                {assignedCustomers.map((c: any) => (
                  <div key={c._id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{c.first_name} {c.last_name}</div>
                      <div className="text-sm text-gray-500">{c.email || "No email on file"}</div>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline" disabled={customerLoading} onClick={() => unassignCustomer(String(c._id))}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Available Customers */}
            <div>
              <h3 className="font-semibold mb-2">Customers</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  className="input input-bordered h-10 border bg-white border-gray-400 flex-1 text-sm"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-auto border p-2 rounded">
                {filteredCustomers.length === 0 && (
                  <p className="text-gray-500 p-2">No customers found.</p>
                )}
                {filteredCustomers.map((c: any) => (
                  <div key={c._id} className="flex items-center justify-between p-3 border rounded bg-white">
                    <div>
                      <div className="font-medium">{c.first_name} {c.last_name}</div>
                      <div className="text-sm text-gray-500">{c.email || "No email on file"}</div>
                    </div>
                    <div>
                      {assignedCustomerIds.includes(String(c._id)) ? (
                        <button className="btn btn-sm btn-disabled">Assigned</button>
                      ) : (
                        <button
                          className="btn btn-sm btn-primary text-white"
                          disabled={customerLoading || !c.email}
                          title={!c.email ? "Customer has no email on file" : ""}
                          onClick={() => assignCustomer(String(c._id))}
                        >
                          Assign & Notify
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
