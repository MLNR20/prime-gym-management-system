// src/router/Router.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/login/Login'
import Contact_View from '../pages/contacts/Contact_View'
import Add_Contacts from '../pages/contacts/Add_Contacts'
import Edit_Contacts from '../pages/contacts/Edit_Contacts'
import Customer_View from '../pages/customers/Customer_View'
import Add_Customers from '../pages/customers/Add_Customer'
import Edit_Customer from '../pages/customers/Edit_Customer'
import Locker_View from '../pages/lockers/Locker_View'
import Add_Locker from '../pages/lockers/Add_Locker'
import Edit_Lockers from '../pages/lockers/Edit_Locker'
import Equipment_View from "../pages/equipment/Equipment_View"
import Add_Equipment from "../pages/equipment/Add_Equipment";
import Edit_Equipment from "../pages/equipment/Edit_Equipment";
import Subscription_History_View from '../pages/subscription/Subscription_View'
import Admin_View from '../pages/admin/Admin_View'
import Attendance_View from '../pages/attendance/Attendance_View'
import Add_Attendance from '../pages/attendance/Add_Attendance'
import Edit_Attendance from '../pages/attendance/Edit_Attendance'
import Exercise_View from '../pages/exercises/Exercise_View'
import Add_Exercise from '../pages/exercises/Add_Exercise'
import Edit_Exercise from '../pages/exercises/Edit_Exercise'
import Program_View from '../pages/programs/Program_View'
import Add_Program from '../pages/programs/Add_Program'
import Edit_Program from '../pages/programs/Edit_Program'
import Program_Manage from '../pages/programs/Program_Manage'
import Inventory_View from '../pages/inventory/Inventory_View'
import Add_Inventory from '../pages/inventory/Add_Inventory'
import Edit_Inventory from '../pages/inventory/Edit_Inventory'
// ...other imports

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/contacts" element={<Contact_View/>}/>
        <Route path="/add_contacts" element={<Add_Contacts/>}/>
        <Route path="/contacts/:id" element={<Edit_Contacts/>}/>
        <Route path="/customers/:id" element={<Edit_Customer/>}/>
        <Route path="/lockers/:id" element={<Edit_Lockers/>}/>
        <Route path="/equipment/" element={<Equipment_View/>}/>
        <Route path="/add_equipment/" element={<Add_Equipment/>}/>
        <Route path="/admin/" element={<Admin_View/>}/>
        <Route path="/equipment/:id" element={<Edit_Equipment/>}/>
        <Route path="/subscription-history" element={<Subscription_History_View/>}/>
        <Route path="/lockers" element={<Locker_View/>}/>
        <Route path="/attendance" element={<Attendance_View/>}/>
        <Route path="/add_attendance" element={<Add_Attendance/>}/>
        <Route path="/attendance/:id" element={<Edit_Attendance/>}/>
        <Route path="/exercises" element={<Exercise_View/>}/>
        <Route path="/add_exercise" element={<Add_Exercise/>}/>
        <Route path="/exercises/:id" element={<Edit_Exercise/>}/>
        <Route path="/programs" element={<Program_View/>}/>
        <Route path="/add_program" element={<Add_Program/>}/>
        <Route path="/programs/:id" element={<Edit_Program/>}/>
        <Route path="/programs/:id/manage" element={<Program_Manage/>}/>
        <Route path="/customers" element={<Customer_View/>}/>
        <Route path='/add_customers' element={<Add_Customers/>}/>
        <Route path='/add_locker' element={<Add_Locker/>}/>
        <Route path="/inventory" element={<Inventory_View/>}/>
        <Route path="/add_inventory" element={<Add_Inventory/>}/>
        <Route path="/inventory/:id" element={<Edit_Inventory/>}/>
      </Routes>
    </BrowserRouter>
  )
}