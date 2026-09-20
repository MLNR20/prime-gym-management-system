import React from "react"
interface CardProps {
  Card_Figure: string;
  Card_Header: string;
  Card_Subheader: string;
  icon?: React.ReactNode;
  iconBg?: string;
  loading?: boolean;
}
export default function Cards({ Card_Figure, Card_Header, Card_Subheader, icon, iconBg = "bg-gray-100", loading = false }: CardProps): React.ReactElement {
  if (loading) {
    return (
      <div className="card mt-2 p-1 bg-white w-full gap-y-4">
        <div className="card-body flex-row items-start gap-4">
          <div className="p-3 rounded-xl bg-gray-100">
            <div className="w-5 h-5 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
            <div className="h-8 w-1/3 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mt-2 p-1 bg-white w-full gap-y-4">
      <div className="card-body flex-row items-start gap-4">
        {icon && (
          <div className={`p-3 rounded-xl ${iconBg}`}>
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-y-2 min-w-0 flex-1">
          <h2 className="card-title font-medium text-md text-black">{Card_Header}</h2>
          <h1 className="font-extrabold text-2xl sm:text-3xl break-words">{Card_Figure}</h1>
          <h2 className="font-light text-sm text-gray-500">{Card_Subheader}</h2>
        </div>
      </div>
    </div>
  )
}
