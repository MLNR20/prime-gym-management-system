import React from "react";
import Sidebar from "../../components/Sidebar";
import useFetchData from "../../data/fetchData";
import TableTemplate from "../../templates/TableTemplate";
import Pills from "../../components/Pills";
import softDeleteData from "../../data/softDeleteData";
import patchAction from "../../data/patchAction";
import { useNavigate } from "react-router-dom";
export default function Admin_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "admin" });
  const navigate = useNavigate();


  const test = async(id: string) => {
    try
    {
      softDeleteData({ url: "admin", id: id });
      alert("Success");
      navigate(0);
    }
    catch(error)
    {
      console.log(error)
    }

  }

  const approveAdmin = async (id: string) => {
    try {
      await patchAction({ url: "admin", id, action: "approve" });
      alert("Admin approved");
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const rejectAdmin = async (id: string) => {
    try {
      await patchAction({ url: "admin", id, action: "reject" });
      alert("Admin rejected");
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const renewAdmin = async (id: string) => {
    try {
      await patchAction({ url: "admin", id, action: "renew" });
      alert("Admin account renewed");
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      header: "#",
      cell: ({ row, table }: any) => {
        const page = table.options.meta?.page ?? 1;
        const limit = table.options.meta?.limit ?? 10;
        return (page - 1) * limit + row.index + 1;
      },
    },
    {
      header: "Full Name",
      accessorFn: (row: any) => `${row.first_name} ${row.last_name}`,
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "OTP Verified",
      accessorKey: "isOtpVerified",
      cell: ({ getValue }: any) => <Pills status={getValue() ? "yes" : "no"} />,
    },
    {
      header: "Access",
      accessorKey: "approvalStatus",
      cell: ({ getValue }: any) => {
        const status = getValue() ?? "approved";
        const label = status.charAt(0).toUpperCase() + status.slice(1);
        const classes =
          status === "approved"
            ? "bg-green-200 text-green-700"
            : status === "rejected"
            ? "bg-red-200 text-red-700"
            : "bg-amber-200 text-amber-700";
        return <div className={`badge badge-soft border-none ${classes}`}>{label}</div>;
      },
    },
    {
      header: "Account Status",
      accessorKey: "isDeleted",
      cell: ({ row }: any) => <Pills status={row.original.isDeleted ? "Inactive" : "Active"} />,
    },

    {
      header: "Date Created",
      accessorKey: "createdAt",
    },
  ];

  console.log(retrieveData);

  return (
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <TableTemplate
          header="Admin Management"
          Url="admin"
          Columns={columns}
          Data={retrieveData}
          additionalFunctionality = {test}
          onApprove={approveAdmin}
          onReject={rejectAdmin}
          onRenew={renewAdmin}
          subheader="Manage user access of your system..."
        />
      </div>
    </div>
  );
}
