import axios from 'axios'
import React, { useState } from 'react'
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

export default function ResetPassword() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [repassword, setRepassword] = useState('')
    const url = "https://job-land-backend.onrender.com";


    const submit = async (e) => {
        e.preventDefault();
        try {
            if (password !== repassword) {
                toast.error("Password doesn't match");
            } else if (password.length < 8) {
                toast.error("Password must be minimum 8 characters");
            } else {
                const cookieVal = Cookies.get('resetEmail')
                await axios.post(`${url}/resetPassword`, { cookieVal, password })
                    .then(res => {
                        if (res.data === "pass") {
                            toast.success("Password changed successfully");
                            Cookies.remove('resetEmail');
                            navigate("/login");
                        } else if (res.data === "fail") {
                            toast.error("Something went wrong!");
                        }
                    }).catch(e => {
                        toast.error("Something went wrong!")
                    })
            }
        } catch (e) {
            toast.error("Something went wrong!");
        }
    }
    return (
        <div>
            <div className="mt-24 flex justify-center">
                <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col items-center shadow-md rounded-sm p-5">
                    <div className="mt-4 p-1 text-2xl font-bold border-b-2 border-black">
                        <Link to="/" className="text-fuchsia-600">
                            Job<span className="text-gray-900">Land</span>
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-fuchsia-600 my-8">Reset Password</h1>
                    <form className="w-full" onSubmit={submit}>
                        <div className="mb-5">
                            <label htmlFor="password" className="leading-7 text-sm text-gray-900">Password</label>
                            <input
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
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
                                value={repassword}
                                onChange={(event) => setRepassword(event.target.value)}
                                required
                                type="password"
                                id="repassword"
                                name="repassword"
                                className="w-full rounded border border-gray-300 text-sm outline-none text-gray-900 px-3 py-2 leading-8"
                            />
                        </div>
                        <div className="flex justify-center">
                            <input
                                className="rounded-md bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-500 sm:w-auto"
                                type="submit"
                                value={"Submit"}
                            />
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </div>
    )
}
