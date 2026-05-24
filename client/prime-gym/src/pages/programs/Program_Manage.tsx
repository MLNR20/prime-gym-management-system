import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Link, useParams, useNavigate } from "react-router-dom";
import useFetchData from "../../data/fetchData";

export default function Program_Manage(): React.ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState<any>(null);
  const [assigned, setAssigned] = useState<any[]>([]);
  const exercisesData = useFetchData({ url: "exercises" }) as any;
  const allExercises: any[] = Array.isArray(exercisesData) ? exercisesData : exercisesData.data || [];
  const [loading, setLoading] = useState(false);

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

  const assignedIds = assigned.map((a) => String(a._id));

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-12 overflow-auto">
        <div className="bg-white p-8 rounded-lg">
          <Header subheader="Manage program exercises" header={program ? program.program_name : "Program"} />

          <div className="flex items-center justify-between my-6">
            <div className="flex items-center gap-4">
              <button className="btn btn-ghost" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
            <div>
              <Link to="/programs">
                <button className="btn btn-outline">Programs</button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Assigned Exercises ({assigned.length})</h3>
              <div className="space-y-2">
                {assigned.length === 0 && <p className="text-gray-500">No exercises assigned.</p>}
                {assigned.map((ex: any) => (
                  <div key={ex._id} className="flex items-center justify-between p-3 border rounded">
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

            <div>
              <h3 className="font-semibold mb-2">Available Exercises</h3>
              <div className="space-y-2 max-h-96 overflow-auto">
                {allExercises.length === 0 && <p className="text-gray-500">No exercises available.</p>}
                {allExercises.map((ex: any) => (
                  <div key={ex._id} className="flex items-center justify-between p-3 border rounded">
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
    </div>
  );
}
