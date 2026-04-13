import React from "react"

interface CardProps{
  Card_Figure: string;
  Card_Header:string;
  Card_Subheader:string; 
}
export default function Cards({Card_Figure, Card_Header, Card_Subheader}: CardProps): React.ReactElement {
  return (
    <div className="card mt-2 p-1 bg-white w-full">
      <div className="card-body">
        <h2 className="card-title font-medium text-md text-black">{Card_Header}</h2>
        <h1 className="font-extrabold my-4 text-4xl">{Card_Figure}</h1>
        <h2 className="card-title font-light text-md text-gray-500">{Card_Subheader}</h2>
      </div>
    </div>
  )
}