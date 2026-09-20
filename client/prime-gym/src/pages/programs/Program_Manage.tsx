import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import useFetchData from "../../data/fetchData";
import { API_URL } from "../../config/api";

export default function Program_Manage(): React.ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState<any>(null);
  const [assigned, setAssigned] = useState<any[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const exercisesData = useFetchData({ url: "exercises" }) as any;
  const allExercises: any[] = Array.isArray(exercisesData) ? exercisesData : exercisesData.data || [];
  const [loading, setLoading] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTargetArea, setSelectedTargetArea] = useState("");
  const [assignedSearchTerm, setAssignedSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/programs/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (res.ok) {
          const json = await res.json();
          setProgram(json);
        }

        const a = await fetch(`${API_URL}/programs/${id}/exercises`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (a.ok) {
          const arr = await a.json();
          setAssigned(arr || []);
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
      const res = await fetch(`${API_URL}/programs/${id}/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ exercise_id: exId }),
      });
      if (res.ok) {
        const assignedRes = await fetch(`${API_URL}/programs/${id}/exercises`, {
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
      const res = await fetch(`${API_URL}/programs/${id}/exercises/${exId}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        const assignedRes = await fetch(`${API_URL}/programs/${id}/exercises`, {
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

  function confirmUnassignExercise(exId: string) {
    setSelectedExerciseId(exId);
    const modal = document.getElementById("remove_exercise_modal");
    if (modal instanceof HTMLDialogElement) modal.showModal();
  }

  async function handleConfirmRemove() {
    if (!selectedExerciseId) return;
    await unassignExercise(selectedExerciseId);
    setSelectedExerciseId(null);
    const modal = document.getElementById("remove_exercise_modal");
    if (modal instanceof HTMLDialogElement) modal.close();
  }

  const assignedIds = assigned.map((a) => String(a._id));

  const filteredAssigned = assigned.filter((ex: any) =>
    ex.exercise_name?.toLowerCase().includes(assignedSearchTerm.toLowerCase())
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
    <div className="flex background-white h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <div className="flex items-start justify-between">
            <Header subheader="Manage program exercises" header={program ? program.program_name : "Program"} />
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>

          <hr className="border-t border-gray-200 mt-6" />

          <div className="flex flex-wrap gap-2 mt-6 mb-4">
            <input
              type="text"
              placeholder="Search assigned exercises..."
              value={assignedSearchTerm}
              onChange={(e) => setAssignedSearchTerm(e.target.value)}
              className="input input-bordered h-10 border bg-white border-gray-400 w-64 text-sm"
            />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered h-10 border bg-white border-gray-400 w-64 text-sm"
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

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column: Assigned Exercises */}
            <div>
              <h3 className="font-semibold mb-2">Assigned Exercises ({assigned.length})</h3>

              <div className="space-y-2">
                {assigned.length === 0 && <p className="text-gray-500">No exercises assigned.</p>}
                {assigned.length > 0 && filteredAssigned.length === 0 && (
                  <p className="text-gray-500">No assigned exercises match your search.</p>
                )}
                {filteredAssigned.map((ex: any) => (
                  <div key={ex._id} className="flex items-center justify-between p-3 border rounded bg-gray-50">
                    <div>
                      <div className="font-medium">{ex.exercise_name}</div>
                      <div className="text-sm text-gray-500">{ex.target_area} • {ex.reps} reps • {ex.sets} sets</div>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline" disabled={loading} onClick={() => confirmUnassignExercise(String(ex._id))}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Available Exercises */}
            <div>
              <h3 className="font-semibold mb-2">Available Exercises</h3>

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
        </div>
      </div>

      <dialog id="remove_exercise_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black shadow-xl border border-gray-200">
          <h3 className="font-bold text-lg">Delete!</h3>
          <p className="py-4">
            You're about to delete <strong>this exercise</strong>? This action
            cannot be reversed!
          </p>

          <div className="modal-action gap-2">
            <button className="btn btn-error text-white" disabled={loading} onClick={handleConfirmRemove}>
              Delete
            </button>
            <form method="dialog">
              <button className="btn btn-neutral btn-outline">Close</button>
            </form>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
