import Navbar from '../parts/Navbar'
import Footer from '../parts/Footer'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
    return (
        <div>
            <Navbar />
            <div className='md:min-h-[calc(100vh-192px)] min-h-[calc(100vh-228px)]'>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default DashboardLayout
