import React from "react";
import Sidebar from "../../components/Sidebar";
import useFetchData from "../../data/fetchData";
export default function Admin_View(): React.ReactElement {

  const retrieveData = useFetchData({ url: "admin" });
  console.log(retrieveData);
  
  return( 
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>


    </div>
  );
}
