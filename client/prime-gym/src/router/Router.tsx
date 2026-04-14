// src/router/Router.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/login/Login'
import Contact_View from '../pages/contacts/Contact_View'
import Add_Contacts from '../pages/contacts/Add_Contacts'
import Edit_Contacts from '../pages/contacts/Edit_Contacts'
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
      </Routes>
    </BrowserRouter>
  )
}