import React from 'react'
import { Outlet } from 'react-router-dom'

const DashboardPage = () => {
    return (
        <div>
            DashboardPage
            <Outlet />
        </div>
    )
}

export default DashboardPage
