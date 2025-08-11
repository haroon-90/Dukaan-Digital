import React, { useState } from 'react'
import Dukaan_Digital from '../../assets/Dukaan_Digital.svg';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md  w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 p-2">
                        {/* <h1 className="text-2xl font-bold text-blue-600">Dukaan Digital</h1> */}
                        <img className="h-18 p-2" src={Dukaan_Digital} alt="Dukaan_Digital" />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                        <a href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">Products</a>
                        <a href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
                        <a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-blue-600 focus:outline-none"
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
                            <a href="/" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50">Home</a>
                            <a href="/products" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50">Products</a>
                            <a href="/pricing" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50">Pricing</a>
                            <a href="/contact" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50">Contact</a>
                            <button className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
