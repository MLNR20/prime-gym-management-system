import React from "react"

interface Pills
{
    taskStatus: string
}
export default function Pills({taskStatus}: Pills): React.ReactElement {


    return(
         <>
            {taskStatus === "Success" && <div className="badge badge-soft badge-success">Success</div>}
            {taskStatus === "Error" && <div className="badge badge-soft badge-error">Error</div>}
            {taskStatus === "Pending" && <div className="badge badge-soft badge-warning">Warning</div>}
        </>
    )

}