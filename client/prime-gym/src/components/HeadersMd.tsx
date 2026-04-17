import React from "react"

interface HeaderProps {
  header: string
  subheader: string
}

export default function HeaderMd({ header, subheader }: HeaderProps): React.ReactElement {
  return (
    <div className="mb-4">
      <h1 className="text-md font-light black mb-2">{header}</h1>
      <h2 className="text-sm  font-light text-gray-500">{subheader}</h2>
    </div>
  )
}