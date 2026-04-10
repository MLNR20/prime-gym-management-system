import React from "react"

interface CardProps{
  Card_Figure: string;
  Card_Header:string;
  Card_Subheader:string; 
}
export default function Cards({Card_Figure, Card_Header, Card_Subheader}): React.ReactElement {
  return (
    <div className="card card-border bg-base-100 w-96">
      <div className="card-body">
        <h2 className="card-title">Card Title</h2>
        <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  )
}