import { useState } from 'react'
import Navbar from '../parts/Navbar'
import Footer from '../parts/Footer'
import AdminSidebar from '../parts/AdminSidebar'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-100">
            <Navbar toggleSidebar={toggleSidebar} />

            <div className="relative flex-1 overflow-y-auto md:rounded-2xl md:rounded-r-none rounded-2xl">
                <Outlet />
            </div>

            <Footer />
        </div>
    );
};

export default DashboardLayout
