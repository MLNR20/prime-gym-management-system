// src/router/Router.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/login/Login'
import Contact_View from '../pages/contacts/Contact_View'
// ...other imports

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/contacts" element={<Contact_View/>}/>
        {/* rest of your routes */}
      </Routes>
    </BrowserRouter>
  )
}