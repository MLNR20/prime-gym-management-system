import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import createData from "../../data/createData";
import useFetchData from "../../data/fetchData";

export default function Program_View(): React.ReactElement {
  const navigate = useNavigate();

  const programsList = useFetchData({ url: "programs" }) as any;

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

    // small delay to feel like generation
    setTimeout(() => {
      setGeneratedTitle(title);
      setIsGenerating(false);
    }, 250);
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
        navigate("/programs");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create program");
    }
  }

  

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header subheader="Let's manage your training programs..." header="Program Management" />
          <div className="flex items-center justify-between my-6">
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

            <div>
              <Link to="/add_program">
                <button className="btn btn-primary text-white">Add Program</button>
              </Link>
            </div>
          </div>
          <div className="mt-6">
            {Array.isArray(programsList) && programsList.length > 0 ? (
                <div className="mt-4">

                  {programsList.map((p: any) => {
                    const exercises = assignedMap[p._id] || [];
                    return (
                      <div key={p._id} className="mt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="py-1 font-semibold">{p.program_name}</p>
                            <div className="text-xs text-gray-500">{exercises.length} assigned exercise{exercises.length !== 1 ? "s" : ""}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link to={`/programs/${p._id}/manage`}>
                              <button className="btn btn-sm btn-outline">Manage</button>
                            </Link>
                            <Link to={`/programs/${p._id}`}>
                              <button className="btn btn-ghost btn-sm">View</button>
                            </Link>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {exercises.length === 0 ? (
                            <div className="text-sm text-gray-500 col-span-3">No exercises assigned.</div>
                          ) : (
                            exercises.map((ex: any) => (
                              <div key={ex._id} className="px-3 py-2 bg-gray-50 border rounded text-sm">
                                <div className="font-medium">{ex.exercise_name}</div>
                                <div className="text-xs text-gray-500">{ex.target_area} • {ex.reps}x{ex.sets}</div>
                              </div>
                            ))
                          )}
                        </div>

                        <hr className="border-t border-2 border-gray-200 mt-4" />
                      </div>
                    );
                  })}
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
