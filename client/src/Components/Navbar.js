import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';




export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    return (
        <header className="text-gray-900 bg-white shadow-md border-b">
            <div className="flex items-center justify-between p-5">
                <div className='uppercase'>
                    <a href='/' className="text-fuchsia-600 font-bold text-2xl md:text-3xl cursor-pointer">
                        Job<span className="text-gray-900">Land</span>
                    </a>
                </div>
                <div className="hidden sm:flex sm:w-1/2 md:w-1/3 lg:w-1/4 justify-evenly">
                    <Link to={"/jobList"} className="cursor-pointer font-semibold text-sm md:text-base">Jobs</Link>
                    <Link className="cursor-pointer font-semibold text-sm md:text-base">Employer/Job Seeker</Link>
                    <Link to={"/login"} className="cursor-pointer font-bold text-sm md:text-base text-fuchsia-600"><FaUser className='text-lg' /></Link>
                </div>
                <div className="sm:hidden">
                    <button className="text-fuchsia-600" onClick={toggleMobileMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className="sm:hidden">
                    <Link to={"/jobList"} className="block px-4 py-2 text-sm font-semibold text-gray-900">Jobs</Link>
                    <Link className="block px-4 py-2 text-sm font-semibold text-gray-900">Employer/Job Seeker</Link>
                    <Link to={"/login"} className="block px-4 py-2 text-sm font-bold text-fuchsia-600">Profile</Link>
                </div>
            )}
        </header>
    )
}
