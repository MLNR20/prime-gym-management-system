import React from "react";
import { Outlet, Link } from "react-router-dom";
import {
  Gauge,
  Wallet,
  ChartArea,
  UserRound,
  Phone,
  Dumbbell,
  CircleUser,
  LogOut,
  KeyRound,
  SportShoe
} from "lucide-react";
import fitwatch from "../assets/fitwatch.png";

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
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-white min-h-full w-72 items-start py-16 px-8">
          <div className="w-full items-center">
            <img src={fitwatch} className="w-24 mx-auto" />
          </div>
      
          <div className="grid mb-4 grid-cols-1 mt-8 w-full gap-4">
            <div className=" w-full">
              <li className="pt-2 pb-2 text-xs text-gray-500">GENERAL</li>
              <div className="grid grid-cols-1 mt-2 w-full gap-1.5">
                <li>
                  <Link to="/">
                    <div className="flex flex-row gap-2 p-1 w-full items-center">
                      <Gauge
                        color="gray"
                        className="my-auto"
                        width="22"
                        height="22"
                      />
                      Dashboard
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <div className="flex flex-row gap-2 p-1 w-full items-start">
                      <ChartArea color="gray" />
                      Analytics
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <div className="flex flex-row gap-2 p-1 w-full items-start">
                      <Wallet color="gray" />
                      Finances
                    </div>
                  </Link>
                </li>
              </div>
            </div>
            <div className=" w-full">
              <li className="pt-2 pb-2 text-xs text-gray-500">OPERATIONS</li>
              <div className="grid grid-cols-1 mt-2 w-full gap-1.5">
                <li className="mt-1">
                  <Link to="/customers">
                    <div className="flex flex-row gap-2 p-1 w-full items-start">
                      <UserRound
                        color="gray"
                        className="my-auto"
                        width="22"
                        height="22"
                      />
                      Customers
                    </div>
                  </Link>
                </li>
                <li className="mt-1">
                  <Link to="/contacts">
                    <div className="flex flex-row gap-2 p-1 w-full items-start">
                      <Phone color="gray" />
                      Contacts
                    </div>
                  </Link>
                </li>
                <li className="mt-1">
                  <Link to="/profile">
                    <div className="flex flex-row gap-2 p-1 w-full items-start">
                      <Dumbbell color="gray" />
                      Exercises
                    </div>
                  </Link>
                </li>
                <li className="mt-1">
                  <Link to="/lockers">
                    <div className="flex flex-row gap-2 p-1 w-full items-start">
                      <KeyRound color="gray" />
                      Lockers
                    </div>
                  </Link>
                </li>
                <li className="mt-1">
                  <Link to="/profile">
                    <div className="flex flex-row gap-2 p-1 w-full items-start">
                      <SportShoe color="gray" />
                      Programs
                    </div>
                  </Link>
                </li>
              </div>
            </div>
            <div className=" w-full">
              <li className="pt-2 pb-2 text-xs text-gray-500">ACTIVITY</li>
              <div className="grid grid-cols-1 mt-2 w-full gap-1.5">
                <li className="mt-1">
                  <Link to="/profile">
                    <div className="flex flex-row gap-2 p-1 w-full items-start">
                      <CircleUser color="gray" />
                      Profile
                    </div>
                  </Link>
                </li>
                <li className="mt-1">
                  <Link to="/profile">
                    <div className="flex flex-row gap-2 p-1 w-full items-start">
                      <LogOut color="gray" />
                      Log Out
                    </div>
                  </Link>
                </li>
              </div>
            </div>
          </div>
              <div className="mt-auto py-2">
            <div className="flex flex-row items-center mt-4 gap-4">
              <div>
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                  </div>
                </div>
              </div>
              <div className="gap-1">
                <h1 className="fw-bold">Coach Andy!</h1>
                <h4 className="text-gray-500 mt-2">andy@gmail.com</h4>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
}
