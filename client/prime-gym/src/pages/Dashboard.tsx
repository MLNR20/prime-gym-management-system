import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header';

export default function Dashboard(): React.ReactElement {
  return (
 <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-24">
        <Header
          header="Dashboard"
          subheader="Welcome back! Let's take a look how your gym is performing..."
        />
      </div>

    </div>
  )
}
