import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import createData from "../../data/createData";
import useFetchData from "../../data/fetchData";
import softDeleteData from "../../data/softDeleteData";
import getWindowedPages from "../../utils/getWindowedPages";
import { Trash2 } from "lucide-react";
import { API_URL } from "../../config/api";
import ConfirmModal from "../../components/ConfirmModal";
import Alert from "../../components/Alert";
import useCrudAlert from "../../utils/useCrudAlert";

export default function Program_View(): React.ReactElement {
  const { alertInfo, setAlertInfo } = useCrudAlert();

  const [page, setPage] = useState(1);
  const programsData = useFetchData({ url: "programs/show", page, limit: 10 }) as any;
  const programsList = programsData.data ?? [];
  const totalPages = programsData.meta?.totalPages ?? 1;
  const totalItems = programsData.meta?.total ?? programsList.length;

  const [generatedTitle, setGeneratedTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [assignedMap, setAssignedMap] = useState<Record<string, any[]>>({});

  const [pendingDeactivate, setPendingDeactivate] = useState<any | null>(null);
  const deactivateModalRef = useRef<HTMLDialogElement>(null);

  const [pendingExerciseDelete, setPendingExerciseDelete] = useState<{ programId: string; exercise: any } | null>(null);
  const exerciseDeleteModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!Array.isArray(programsList)) return;

    const missing = programsList.filter((p: any) => p && p._id && !assignedMap[p._id]);
    if (missing.length === 0) return;

    missing.forEach((p: any) => {
      fetch(`${API_URL}/programs/${p._id}/exercises`, {
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

  function requestDeleteExercise(programId: string, exercise: any) {
    setPendingExerciseDelete({ programId, exercise });
    exerciseDeleteModalRef.current?.showModal();
  }

  async function confirmDeleteExercise() {
    if (!pendingExerciseDelete) return;
    const { programId, exercise } = pendingExerciseDelete;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/programs/${programId}/exercises/${exercise._id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error("Failed to delete exercise");

      setAssignedMap((prev) => ({
        ...prev,
        [programId]: (prev[programId] || []).filter((ex: any) => ex._id !== exercise._id),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to remove exercise");
    } finally {
      exerciseDeleteModalRef.current?.close();
      setPendingExerciseDelete(null);
    }
  }

  function requestDeactivateProgram(program: any) {
    setPendingDeactivate(program);
    deactivateModalRef.current?.showModal();
  }

  async function confirmDeactivateProgram() {
    if (!pendingDeactivate) return;

    try {
      await softDeleteData({ url: "programs", id: pendingDeactivate._id });
      deactivateModalRef.current?.close();
      sessionStorage.setItem(
        "crudAlert",
        JSON.stringify({ message: "Program deactivated", variant: "success" })
      );
      window.location.reload();
    } catch (err) {
      console.error(err);
      deactivateModalRef.current?.close();
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
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      {alertInfo && (
        <Alert
          message={alertInfo.message}
          variant={alertInfo.variant}
          onClose={() => setAlertInfo(null)}
        />
      )}

      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-6 sm:p-16 rounded-lg min-h-full flex flex-col">
          <Header subheader="Let's manage your training programs..." header="Program Management" />
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mt-6 mb-0">
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
            </div>
            <div className="flex max-sm:flex-col-reverse items-center gap-4">
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
                      <div className="flex items-end justify-between">
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
                                onClick={() => requestDeactivateProgram(p)}
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
                                onClick={() => requestDeleteExercise(p._id, ex)}
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

      <ConfirmModal
        ref={deactivateModalRef}
        title="Deactivate Program"
        message={
          <>
            Deactivate{" "}
            <span className="font-semibold">{pendingDeactivate?.program_name}</span>? Its
            assigned exercises will also be removed.
          </>
        }
        confirmLabel="Deactivate"
        confirmClassName="btn btn-error text-white"
        onConfirm={confirmDeactivateProgram}
      />

      <ConfirmModal
        ref={exerciseDeleteModalRef}
        title="Remove Exercise"
        message={
          <>
            Remove{" "}
            <span className="font-semibold">
              {pendingExerciseDelete?.exercise?.exercise_name}
            </span>{" "}
            from this program?
          </>
        }
        confirmLabel="Remove"
        confirmClassName="btn btn-error text-white"
        onConfirm={confirmDeleteExercise}
      />
    </div>
  );
}
