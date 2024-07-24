import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';



export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/login", { form })
                .then(res => {
                    if (res.data === "loginpass") {
                        Cookies.set("email", form.email, { expires: 7 })
                        toast.success("Successfully Login...");
                        // navigate("/admin")
                    } else if (res.data === "nouser") {
                        toast.error("Oops! Email is not registered");
                    } else if (res.data === "loginfail") {
                        toast.error("Invalid Credential");
                    } else if (res.data === "fail") {
                        toast.error("Something went wrong!");
                    }
                }).catch(e => {
                    toast.error("Something went wrong!");
                })
        } catch (e) {
            toast.error("Something went wrong!");
        }
    }


    return (
        <div className="mt-24 flex justify-center">
            <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col items-center shadow-md rounded-sm p-5">
                <div className="mt-4 p-1 text-2xl font-bold border-b-2 border-black">
                    <Link to="/" className="text-fuchsia-600">
                        Job<span className="text-gray-900">Land</span>
                    </Link>
                </div>
                <h1 className="text-2xl font-bold text-fuchsia-600 my-8">Login</h1>
                <form className="w-full" action='POST' method='/login' onSubmit={submit}>
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
                    <div className="mb-8">
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
                    <div className="flex justify-center">
                        <input
                            className="rounded-md bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-500 sm:w-auto"
                            type="submit"
                            value="Login"
                        />
                    </div>
                </form>
                <div className="my-5 text-sm">
                    <p>
                        Don't have an account? <Link to="/signup" className="text-fuchsia-600 font-bold">Create Account</Link>
                    </p>
                    <p className='text-center pt-5'>
                        <Link to="/forgotPassword" className="text-fuchsia-600 font-bold">Forgot Password</Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
