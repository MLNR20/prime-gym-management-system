import React from "react"

interface HeaderProps {
  header: string
  subheader: string
}

export default function Header({ header, subheader }: HeaderProps): React.ReactElement {
  return (
    <div className="w-full">
      <div className="text-xl sm:text-2xl font-bold black mb-2 sm:mb-4">{header}</div>
      <div className="text-base sm:text-lg lg:text-xl font-regular text-gray-500">{subheader}</div>
    </div>
  )
}