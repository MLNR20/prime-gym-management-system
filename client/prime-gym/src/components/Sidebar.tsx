import React from "react"
import { Outlet } from "react-router-dom"

export default function Sidebar(): React.ReactElement {
  return (
    <div className="drawer lg:drawer-open w-full">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        {/* Navbar / toggle button for mobile */}
        <label htmlFor="my-drawer-3" className="btn drawer-button lg:hidden">
          Open drawer
        </label>

        {/* Page content renders here */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side bg-white">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-white min-h-full w-80 p-4">
        <li>General</li>
          <li><a>Dashboard</a></li>
          <li><a>Analytics</a></li>
          <li>Functions</li>
          <li><a>Customers</a></li>
        </ul>
      </div>
    </div>
  )
}