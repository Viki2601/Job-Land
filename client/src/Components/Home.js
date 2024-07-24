import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);
    return (
        <div className="p-10">
            <div className="flex flex-col lg:flex-row justify-around items-center">
                <div className={`text-center lg:text-left lg:w-1/2 mb-5 lg:mb-0 ${animate ? 'animate-slideLeft' : ''}`}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
                        Get Your <span className="text-fuchsia-600">Dream Job</span>
                        <br /> Today!
                    </h1>
                    <h4 className='text-2xl font-semibold mt-10 mb-8'>Discover a lot of career opportunities</h4>
                    <Link to={"/login"} className="rounded-md bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-500 sm:w-auto">Get Started</Link>
                </div>
                <div className="lg:w-1/2">
                    <img
                        className={`h-full w-full object-cover object-center rounded-lg ${animate ? 'animate-slideRight' : ''}`}
                        src="https://cdn.pixabay.com/photo/2023/01/26/08/21/business-7745315_1280.png"
                        alt="Job Search"
                    />
                </div>
            </div>
        </div>
    )
}
