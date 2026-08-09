import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import createData from "../../data/createData";
import useFetchData from "../../data/fetchData";
import softDeleteData from "../../data/softDeleteData";
import getWindowedPages from "../../utils/getWindowedPages";
import { Trash2 } from "lucide-react";

export default function Program_View(): React.ReactElement {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const programsData = useFetchData({ url: "programs/show", page, limit: 10 }) as any;
  const programsList = programsData.data ?? [];
  const totalPages = programsData.meta?.totalPages ?? 1;
  const totalItems = programsData.meta?.total ?? programsList.length;

  const [generatedTitle, setGeneratedTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [assignedMap, setAssignedMap] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!Array.isArray(programsList)) return;

    const missing = programsList.filter((p: any) => p && p._id && !assignedMap[p._id]);
    if (missing.length === 0) return;

    missing.forEach((p: any) => {
      fetch(`http://localhost:3002/programs/${p._id}/exercises`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setAssignedMap((prev) => ({ ...prev, [p._id]: data || [] }));
        })
        .catch((err) => console.error(err));
    });
  }, [programsList]);

  function generateTitle() {
    setIsGenerating(true);
    const templates = [
      "Full Body Blast",
      "Strength Builder",
      "HIIT Shred",
      "Endurance Boost",
      "Core & Mobility",
      "Power Gain Program",
      "Fat Loss Accelerator",
      "Muscle Mass Builder",
      "Conditioning Circuit",
      "Functional Fitness"
    ];

    const suffixes = ["Beginner", "Intermediate", "Advanced", "30 Days", "8 Weeks", "12 Weeks"];

    const pick = templates[Math.floor(Math.random() * templates.length)];
    const suf = suffixes[Math.floor(Math.random() * suffixes.length)];

    const title = `${pick} — ${suf}`;

    setTimeout(() => {
      setGeneratedTitle(title);
      setIsGenerating(false);
    }, 250);
  }

  async function deleteExercise(programId: string, exerciseId: string) {
    if (!window.confirm("Remove this exercise from the program?")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3002/programs/${programId}/exercises/${exerciseId}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error("Failed to delete exercise");

      setAssignedMap((prev) => ({
        ...prev,
        [programId]: (prev[programId] || []).filter((ex: any) => ex._id !== exerciseId),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to remove exercise");
    }
  }

  async function deactivateProgram(programId: string) {
    if (!window.confirm("Deactivate this program? Its assigned exercises will also be removed.")) {
      return;
    }

    try {
      await softDeleteData({ url: "programs", id: programId });
      alert("Program deactivated");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to deactivate program");
    }
  }

  async function createProgramFromTitle() {
    if (!generatedTitle.trim()) {
      alert("Please generate or enter a program title first.");
      return;
    }

    try {
      const payload = {
        program_name: generatedTitle,
        description: "",
        date_assigned: new Date().toISOString(),
      };

      const res = await createData({ url: "programs", data: payload });
      if (res) {
        alert("Program created");
        setPage(1); // Go back to first page to see the new program
        setGeneratedTitle("");
        window.location.reload();
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message ?? "Failed to create program");
    }
  }

  return (
    <div className="flex background-white h-screen p-6 md:p-0 lg:p-0 lg:flex-row md:flex-row flex-col overflow-hidden">
      <div className="w-full md:w-48 lg:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 md:p-24 lg:p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg min-h-full flex flex-col">
          <Header subheader="Let's manage your training programs..." header="Program Management" />
          <div className="flex items-center justify-between mt-6 mb-0">
            <div className="flex items-center gap-4">
              <label className="label">
                <span className="label-text text-black">Program Title</span>
              </label>
              <input
                value={generatedTitle}
                onChange={(e) => setGeneratedTitle(e.target.value)}
                placeholder="Generate or enter a program title"
                className="input input-bordered h-12 border bg-white border-gray-700 w-96"
              />
              <button className="btn btn-neutral" onClick={generateTitle} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate"}
              </button>
              <button className="btn btn-success text-white" onClick={createProgramFromTitle}>
                Create Program
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col mt-2">
            {Array.isArray(programsList) && programsList.length > 0 ? (
              <div className="flex-1 flex flex-col">
                {programsList.map((p: any) => {
                  const exercises = assignedMap[p._id] || [];
                  return (
                    <div key={p._id} className="mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold">{p.program_name}</p>
                          <div className="text-sm text-gray-500">{exercises.length} assigned exercise{exercises.length !== 1 ? "s" : ""}</div>
                        </div>

                        <div className="dropdown dropdown-end">
                          <button tabIndex={0} className="btn btn-sm btn-outline text-xs px-2">
                            Actions ▾
                          </button>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu menu-sm bg-white border rounded-lg shadow-lg z-10 w-40 p-2 gap-1"
                          >
                            <li>
                              <Link to={`/programs/${p._id}/manage`}>Manage</Link>
                            </li>
                            <li>
                              <Link to={`/programs/${p._id}`}>View</Link>
                            </li>
                            <li>
                              <button
                                className="text-error"
                                onClick={() => deactivateProgram(p._id)}
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-1 flex flex-wrap gap-2">
                        {exercises.length === 0 ? (
                          <div className="text-base text-gray-500">No exercises assigned.</div>
                        ) : (
                          exercises.map((ex: any) => (
                            <div key={ex._id} className="px-3 py-2 bg-gray-50 border rounded text-base flex items-start justify-between gap-2 w-64">
                              <div>
                                <div className="font-medium">{ex.exercise_name}</div>
                                <div className="text-sm text-gray-500">{ex.target_area} • {ex.reps}x{ex.sets}</div>
                              </div>
                              <button
                                className="btn btn-xs btn-ghost text-error group"
                                title="Delete exercise"
                                onClick={() => deleteExercise(p._id, ex._id)}
                              >
                                <Trash2 size={14} className="fill-transparent group-hover:fill-current" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <hr className="border-t border-2 border-gray-200 mt-4" />
                    </div>
                  );
                })}

                {/* Pagination Controls */}
                <div className="flex gap-3 justify-between items-center mt-auto pt-8">
                  <div className="flex gap-3 items-center">
                  <button
                    className={
                      page === 1
                        ? "text-gray-400 font-normal btn bg-transparent border-none"
                        : "hover:bg-black hover:text-white bg-transparent btn border-none text-black"
                    }
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Prev
                  </button>

                  {getWindowedPages(page, totalPages).map((p) => (
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

                  <span className="text-base text-gray-500">
                    Showing {programsList.length} of {totalItems}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No programs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
