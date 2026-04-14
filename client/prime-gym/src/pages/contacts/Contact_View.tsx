import React from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";

export default function Contact_View(): React.ReactElement {

  const retrieveData = useFetchData({url:"contacts"})
  console.log("Data:", retrieveData)
  console.log(retrieveData);

const columns = [
  {
    header: "#",
    cell: ({ row }: any) => row.index + 1,
  },
  {
    header: "First Name",
    accessorKey: "first_name",
  },
  {
    header: "Last Name",
    accessorKey: "last_name",
  },
  {
    header: "Contact Number",
    accessorKey: "contact_number",
  },
{
    header: "Role",
    accessorKey: "role",
  },
  
  {
    header: "Created",
    accessorKey: "createdAt",
  },
  {
    header: "Updated",
    accessorKey: "updatedAt",
  },
];
  return (
    <div className="flex background-white  h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-24   overflow-auto">
        <CRUDTemplate
          header="Contact Management"
          Columns={columns}
          Data={retrieveData}
          url = "contacts"
          ButtonString="Add Contact"
          subheader="Let's manage and handle your contacts..."
        />
      </div>
    </div>
  );
}
