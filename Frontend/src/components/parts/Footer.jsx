import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold">Dukaan Digital</h3>
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
