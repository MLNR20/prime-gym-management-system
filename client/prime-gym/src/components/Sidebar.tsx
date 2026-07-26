import React from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
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
  Notebook,
  ScrollText,
  BookUser,
  Package2,
  ShoppingCart,
  SportShoe,
  Wrench,
  PiggyBank,
  Timer,
} from "lucide-react";
import fitwatch from "../assets/fitwatch.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useFetchData from "../data/fetchData";

export default function Sidebar(): React.ReactElement {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const adminProfile = useFetchData({ url: "admin/me" });
  const adminName = [adminProfile?.first_name, adminProfile?.last_name]
    .filter(Boolean)
    .join(" ");
  const adminEmail = adminProfile?.email;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="drawer md:drawer-open lg:drawer-open w-full">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar / toggle button for mobile */}
        <label htmlFor="my-drawer-3" className="btn drawer-button md:hidden lg:hidden">
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
            {/*OVERVIEW SECTION*/}
            <div className="w-full mt-4">
              <div className="collapse collapse-arrow ">
                <input type="checkbox" defaultChecked />
                <div className="collapse-title text-gray-500 p-0 min-h-0">
                  GENERAL
                </div>
                <div className="collapse-content  p-0 min-h-0 text-sm">
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
                      <Link to="/analytics">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <ChartArea color="gray" />
                          Analytics
                        </div>
                      </Link>
                    </li>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-300 my-2 w-full"></div>
            {/*MEMBER SECTION*/}
            <div className="w-full">
              <div className="collapse collapse-arrow ">
                <input type="checkbox" defaultChecked />
                <div className="collapse-title text-gray-500 p-0 min-h-0">
                  MEMBERS
                </div>
                <div className="collapse-content  p-0 min-h-0 text-sm">
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
                      <Link to="/attendance">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <Notebook color="gray" />
                          Attendance
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
                      <Link to="/lockers">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <KeyRound color="gray" />
                          Lockers
                        </div>
                      </Link>
                    </li>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-300 my-2 w-full"></div>

            {/*EXERCISE SECTION*/}
            <div className="w-full">
              <div className="collapse collapse-arrow ">
                <input type="checkbox" defaultChecked />
                <div className="collapse-title text-gray-500 p-0 min-h-0">
                  EXERCISE
                </div>
                <div className="collapse-content  p-0 min-h-0 text-sm">
                  <div className="grid grid-cols-1 mt-2 w-full gap-1.5">
                    <li className="mt-1">
                      <Link to="/exercises">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <Dumbbell color="gray" />
                          Exercises
                        </div>
                      </Link>
                    </li>
                    <li className="mt-1">
                      <Link to="/programs">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <SportShoe color="gray" />
                          Programs
                        </div>
                      </Link>
                    </li>
                    <li className="mt-1">
                      <Link to="/sessions">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <Timer color="gray" />
                          Sessions
                        </div>
                      </Link>
                    </li>
                    <li className="mt-1">
                      <Link to="/sessions/assign">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <Timer color="gray" />
                          Assign Sessions
                        </div>
                      </Link>
                    </li>
                    <li className="mt-1">
                      <Link to="/sessions/history">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <ScrollText color="gray" />
                          Assignment History
                        </div>
                      </Link>
                    </li>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-300 my-2 w-full"></div>
            {/*BUSINESS SECTION*/}
            <div className="w-full">
              <div className="collapse collapse-arrow ">
                <input type="checkbox" defaultChecked />
                <div className="collapse-title text-gray-500 p-0 min-h-0">
                  BUSINESS
                </div>
                <div className="collapse-content  p-0 min-h-0 text-sm">
                  <div className="grid grid-cols-1 mt-2 w-full gap-1.5">
                    <li className="mt-1">
                      <Link to="/subscription-history">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <ScrollText color="gray" />
                          Subscription History
                        </div>
                      </Link>
                    </li>
                    <li className="mt-1">
                      <Link to="/equipment">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <Wrench color="gray" />
                          Equipment
                        </div>
                      </Link>
                    </li>
                    <li className="mt-1">
                      <Link to="/admin">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <BookUser color="gray" />
                          Admin
                        </div>
                      </Link>
                    </li>
                    <li className="mt-1">
                      <Link to="/inventory">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <Package2 color="gray" />
                          Inventory
                        </div>
                      </Link>
                    </li>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-300 my-2 w-full"></div>
            {/*SALES & FINANCES SECTION*/}
            <div className="w-full">
              <div className="collapse collapse-arrow ">
                <input type="checkbox" defaultChecked />
                <div className="collapse-title text-gray-500 p-0 min-h-0">
                  SALES &amp; FINANCES
                </div>
                <div className="collapse-content  p-0 min-h-0 text-sm">
                  <div className="grid grid-cols-1 mt-2 w-full gap-1.5">
                    <li className="mt-1">
                      <Link to="/sales">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <ShoppingCart color="gray" />
                          Sales
                        </div>
                      </Link>
                    </li>
                    <li className="mt-1">
                      <Link to="/expenses">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <Wallet color="gray" />
                          Expenses
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/finances">
                        <div className="flex flex-row gap-2 p-1 w-full items-start">
                          <PiggyBank color="gray" />
                          Finances
                        </div>
                      </Link>
                    </li>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-300 my-2 w-full"></div>
            {/*ACCOUNT SECTION*/}
            <div className="w-full">
              <div className="text-gray-500 p-0 min-h-0">PROFILE</div>
              <div className="grid grid-cols-1 mt-2 w-full gap-1.5 text-sm">
                <li className="mt-1">
                  <Link to="/profile">
                    <div className="flex flex-row gap-2 p-1 w-full items-start">
                      <CircleUser color="gray" />
                      Profile
                    </div>
                  </Link>
                </li>
                <li className="mt-1">
                  <button onClick={handleLogout} className="w-full">
                    <div className="flex flex-row gap-2 p-1 w-full items-start">
                      <LogOut color="gray" />
                      Log Out
                    </div>
                  </button>
                </li>
              </div>
            </div>
            <div className="border-t border-gray-300 my-2 w-full"></div>
            {/*PROFILE SECTION*/}
            <div className="w-full">
              <div className="flex flex-row items-center gap-4 p-2">
                <div className="flex flex-col min-w-0 gap-0.5">
                  <span className="font-bold text-black text-base truncate">
                    {adminName || "Admin"}
                  </span>
                  <span className="text-gray-500 text-sm truncate">
                    {adminEmail ?? ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
}
