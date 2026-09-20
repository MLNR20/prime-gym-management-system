import React from "react";
import Sidebar from "./Sidebar";

type EditLoadingScreenProps = {
  message?: string;
};

export default function EditLoadingScreen({
  message = "Loading record...",
}: EditLoadingScreenProps): React.ReactElement {
  return (
    <div className="flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">{message}</div>
      </div>
    </div>
  );
}
