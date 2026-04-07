import React from "react"

interface HeaderProps {
  header: string
  subheader: string
}

export default function Header({ header, subheader }: HeaderProps): React.ReactElement {
  return (
    <div>
      <div className="text-2xl font-bold black mb-4">{header}</div>
      <div className="text-xl font-regular text-gray-500">{subheader}</div>
    </div>
  )
}