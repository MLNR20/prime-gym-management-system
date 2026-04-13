import React from "react"

interface HeaderProps {
  header: string
  subheader: string
}

export default function HeaderMd({ header, subheader }: HeaderProps): React.ReactElement {
  return (
    <div className="mb-4">
      <div className="text-lg font-semibold black mb-2">{header}</div>
      <div className="text-md font-light text-gray-500">{subheader}</div>
    </div>
  )
}