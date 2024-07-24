import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Signup() {
    const navigate = useNavigate();
    const url = "https://job-land-backend.onrender.com";
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        repassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            if (form.password.length < 8) {
                toast.error('Password must be minimum 8 characters');
            } else if (form.password !== form.repassword) {
                toast.error("Passwords don't match");
            } else {
                const response = await axios.post(`${url}/signup`, { form });

                if (response.data === 'exists') {
                    toast.error('Email already exists');
                } else if (response.data === 'notexists') {
                    Cookies.set('email', form.email, { expires: 7 });
                    toast.success('Successfully registered', { autoClose: 1000 });
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            }
        } catch (error) {
            toast.error('Something went wrong!');
        }
    };

    return (
        <div className="mt-10 flex justify-center">
            <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col items-center shadow-md rounded-sm p-5">
                <div className="mt-1 p-1 text-2xl font-bold border-b-2 border-black">
                    <Link to="/" className="text-fuchsia-600">
                        Job<span className="text-gray-900">Land</span>
                    </Link>
                </div>
                <h1 className="text-2xl font-bold text-fuchsia-600 my-5">Signup</h1>
                <form className="w-full" onSubmit={submit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="leading-7 text-sm text-gray-900">Username</label>
                        <input
                            value={form.name}
                            onChange={handleChange}
                            required
                            type="text"
                            id="name"
                            name="name"
                            className="w-full rounded border border-gray-300 text-sm outline-none text-gray-900 px-3 py-2 leading-8"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="leading-7 text-sm text-gray-900">Email</label>
                        <input
                            value={form.email}
                            onChange={handleChange}
                            required
                            type="email"
                            id="email"
                            name="email"
                            className="w-full rounded border border-gray-300 text-sm outline-none text-gray-900 px-3 py-2 leading-8"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="leading-7 text-sm text-gray-900">Password</label>
                        <input
                            value={form.password}
                            onChange={handleChange}
                            required
                            type="password"
                            id="password"
                            name="password"
                            className="w-full rounded border border-gray-300 text-sm outline-none text-gray-900 px-3 py-2 leading-8"
                        />
                    </div>
                    <div className="mb-8">
                        <label htmlFor="repassword" className="leading-7 text-sm text-gray-900">Confirm Password</label>
                        <input
                            value={form.repassword}
                            onChange={handleChange}
                            required
                            type="password"
                            id="repassword"
                            name="repassword"
                            className="w-full rounded border border-gray-300 text-sm outline-none text-gray-900 px-3 py-2 leading-8"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="rounded-md bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-500 sm:w-auto"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <div className="my-5 text-sm">
                    <p>
                        Already have an account? <Link to="/login" className="text-fuchsia-600 font-bold">Login now</Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
