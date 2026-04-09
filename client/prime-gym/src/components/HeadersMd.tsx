import React from "react"

interface HeaderProps {
  header: string
  subheader: string
}

export default function HeaderMd({ header, subheader }: HeaderProps): React.ReactElement {
  return (
    <div>
      <div className="text-xl font-bold black mb-4">{header}</div>
      <div className="text-lg font-regular text-gray-500">{subheader}</div>
    </div>
  )
}