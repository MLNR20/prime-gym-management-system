import React from "react"

interface Pills
{
    status: string
}
export default function Pills({status}: Pills): React.ReactElement {


    return(
         <>
            {(status === "Success" || status==="Paid") && <div className="badge badge-soft bg-green-200 border-none text-green-700 badge-success">{status}</div>}
            {(status === "Error" || status==="Expired") && <div className="badge bg-red-200 border-none text-red-700 badge-soft badge-error">{status}</div>}
            {status === "false" && <div className="badge badge-soft bg-green-200 border-none text-green-700 badge-success">Active</div>}
            {status === "true" && <div className="badge bg-red-200 border-none text-red-700 badge-soft badge-error">Inactive</div>}
            {status === "Pending" && <div className="badge badge-soft badge-warning">{status}</div>}
        </>
    )

}