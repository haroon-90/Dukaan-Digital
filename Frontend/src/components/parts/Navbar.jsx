import React, { useState } from 'react'
import Dukaan_Digital from '../../assets/Dukaan_Digital.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md  w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 p-2">
                        <img className="h-18 p-2" src={Dukaan_Digital} alt="Dukaan_Digital" />
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" className="text-black hover:text-purple-600 hover:border-b-2 transition-all">Home</NavLink>
                        <NavLink to="/products" className="text-black hover:text-purple-600 hover:border-b-2 transition-all">Products</NavLink>
                        <NavLink to="/sales" className="text-black hover:text-purple-600 hover:border-b-2 transition-all">Sales</NavLink>
                        <NavLink to="/expenses" className="text-black hover:text-purple-600 hover:border-b-2 transition-all">Expenses</NavLink>
                        <NavLink to="/udhaar" className="text-black hover:text-purple-600 hover:border-b-2 transition-all">Credit</NavLink>
                        <NavLink to="/reports" className="text-black hover:text-purple-600 hover:border-b-2 transition-all">Report</NavLink>
                        <button
                            onClick={() => { sessionStorage.clear(); navigate('/login') }}
                            className='px-2 py-1 flex gap-2 items-center bg-purple-600 hover:bg-purple-700 rounded-lg text-white'
                        ><LogOut size={18} />Logout</button>
                    </div>
                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-black hover:text-purple-600 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <NavLink to="/" className="block px-3 py-2 rounded-md text-black hover:text-purple-600 hover:bg-black">Home</NavLink>
                            <NavLink to="/products" className="block px-3 py-2 rounded-md text-black hover:text-purple-600 hover:bg-black">Products</NavLink>
                            <NavLink to="/sales" className="block px-3 py-2 rounded-md text-black hover:text-purple-600 hover:bg-black">Sales</NavLink>
                            <NavLink to="/expenses" className="block px-3 py-2 rounded-md text-black hover:text-purple-600 hover:bg-black">Expenses</NavLink>
                            <NavLink to="/udhaar" className="block px-3 py-2 rounded-md text-black hover:text-purple-600 hover:bg-black">Udhaar</NavLink>
                            <NavLink to="/report" className="block px-3 py-2 rounded-md text-black hover:text-purple-600 hover:bg-black">Report</NavLink>
                            <button
                                onClick={() => { sessionStorage.clear(); navigate('/login') }}
                                className='px-2 py-1 flex gap-2 items-center bg-purple-600 hover:bg-purple-700 rounded-lg text-white'
                            ><LogOut size={18} />Logout</button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
