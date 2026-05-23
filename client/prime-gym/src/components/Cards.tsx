import React from "react"
interface CardProps {
  Card_Figure: string;
  Card_Header: string;
  Card_Subheader: string;
  icon?: React.ReactNode;
  iconBg?: string;
}
export default function Cards({ Card_Figure, Card_Header, Card_Subheader, icon, iconBg = "bg-gray-100" }: CardProps): React.ReactElement {
  return (
    <div className="card mt-2 p-1 bg-white w-full gap-y-4">
      <div className="card-body flex-row items-start gap-4">
        {icon && (
          <div className={`p-3 rounded-xl ${iconBg}`}>
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-y-2">
          <h2 className="card-title font-medium text-md text-black">{Card_Header}</h2>
          <h1 className="font-extrabold text-3xl">{Card_Figure}</h1>
          <h2 className="font-light text-sm text-gray-500">{Card_Subheader}</h2>
        </div>
      </div>
    </div>
  )
}
