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
        <Route path="/customers" element={<Customer_View/>}/>
        <Route path='/add_customers' element={<Add_Customers/>}/>
        <Route path='/add_locker' element={<Add_Locker/>}/>
      </Routes>
    </BrowserRouter>
  )
}