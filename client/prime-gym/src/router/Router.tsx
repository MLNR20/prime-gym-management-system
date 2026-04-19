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
        <Route path="/lockers" element={<Locker_View/>}/>
        <Route path="/customers" element={<Customer_View/>}/>
        <Route path='/add_customers' element={<Add_Customers/>}/>
      </Routes>
    </BrowserRouter>
  )
}