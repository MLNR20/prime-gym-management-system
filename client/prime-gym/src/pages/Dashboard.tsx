import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Cards from "../components/Cards";
import Tables from "../components/Tables";
import CRUDTemplate from "../templates/CRUDTemplate";
import fetchData from "../data/fetchData";

import softDeleteData from "../data/softDeleteData"

export default function Dashboard(): React.ReactElement {

  const userToken =  fetchData({url:"contacts"})


  const dataDel = softDeleteData({ url: "contacts", id: "69dd894408532e7ad0a731f7" });

  console.log(userToken)
  console.log(dataDel)
  const data = [
    {
      firstName: "Miguel",
      lastName: "Rivadenera",
      email: "miguel@example.com",
      dateCreated: "2026-04-01",
      dateUpdated: "2026-04-05",
    },
    {
      firstName: "Juan",
      lastName: "Dela Cruz",
      email: "juan@example.com",
      dateCreated: "2026-03-28",
      dateUpdated: "2026-04-02",
    },
    {
      firstName: "Maria",
      lastName: "Santos",
      email: "maria@example.com",
      dateCreated: "2026-03-25",
      dateUpdated: "2026-04-01",
    },
    {
      firstName: "Carlos",
      lastName: "Reyes",
      email: "carlos@example.com",
      dateCreated: "2026-03-20",
      dateUpdated: "2026-03-30",
    },
  ];

  const columns = [
  {
    header: "#",
    cell: ({ row }: any) => row.index + 1,
  },
  {
    header: "First Name",
    accessorKey: "firstName",
  },
  {
    header: "Last Name",
    accessorKey: "lastName",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Created",
    accessorKey: "dateCreated",
  },
  {
    header: "Updated",
    accessorKey: "dateUpdated",
  },
];
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      
      {/* Main Content */}
      <div className="flex-1 p-24 overflow-auto">
        <Header
          header="Dashboard"
          subheader="Welcome back! Let's take a look how your gym is performing..."
        />
      </div>
    </div>
  );
}
