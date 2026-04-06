import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header';

export default function Dashboard(): React.ReactElement {
  return (
   <div className="flex flex-row">
        <div className="w-2/12 flex-auto">
            <Sidebar/>
        </div>
        <div className="w-10/12 flex-auto p-20">
            <Header header="Dashboard" subheader="Your stats, charts, and data will go here."/>
        </div>
    </div>
  )
}
