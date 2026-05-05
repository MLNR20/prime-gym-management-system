import React from "react";
import Sidebar from "../../components/Sidebar";
export default function Admin_View(): React.ReactElement {
  return( 
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>


    </div>
  );
}
