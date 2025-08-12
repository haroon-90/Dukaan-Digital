import React from 'react'
import Dukaan_Digital from '../../assets/Dukaan_Digital.svg';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 flex items-center gap-4 md:mb-0">
                        <img className="h-15 p-2 invert" src={Dukaan_Digital} alt="Dukaan_Digital" />
                        <p className="text-sm mt-2">Your Digital Business Solution</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-gray-300">About</a>
                        <a href="#" className="hover:text-gray-300">Services</a>
                        <a href="#" className="hover:text-gray-300">Contact</a>
                    </div>
                </div>
                <div className="text-center mt-4 text-sm">
                    <p>&copy; {new Date().getFullYear()} Dukaan Digital. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
