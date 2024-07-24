import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

export default function ApplicationForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const job = location.state?.job;
    const url = "https://job-land-backend.onrender.com";


    const [application, setApplication] = useState({
        fullName: '',
        applicationFor: job.jobtitle,
        company: job.company,
        applicationJobId: job._id,
        email: '',
        salaryExpectation: '',
        about: '',
    });
    const [resume, setResume] = useState("");

    const handleUpdate = async (e) => {
        e.preventDefault();
        const applicationFormDetails = new FormData();
        applicationFormDetails.append("fullName", application.fullName);
        applicationFormDetails.append("applicationFor", job.jobtitle);
        applicationFormDetails.append("company", job.company);
        applicationFormDetails.append("applicationJobId", job._id);
        applicationFormDetails.append("email", application.email);
        applicationFormDetails.append("salaryExpectation", application.salaryExpectation);
        applicationFormDetails.append("about", application.about);
        applicationFormDetails.append("resume", resume);

        try {
            const res = await axios.post(`${url}/application`, applicationFormDetails, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data === 'pass') {
                toast.success("Applied Successfully");
                navigate(-1);
            } else {
                toast.error("Something went wrong!");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setApplication(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 md:p-8 lg:p-10">
                <button onClick={goBack} className="flex items-center mb-4">
                    <FaArrowLeft className="w-5 h-5 text-fuchsia-600" />
                    <span className="ml-2 text-fuchsia-600">Back</span>
                </button>
                <h3 className="m-3 text-base font-semibold leading-7 text-gray-900 text-center">Applicant Information</h3>
                <form onSubmit={handleUpdate} className="mt-6 p-5 border-t border-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">Full name<span className='text-red-700'>*</span></dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <input
                                type="text"
                                name="fullName"
                                required
                                className="mt-1 block w-full outline-none border-b-2 border-gray-300 focus:border-fuchsia-500 sm:text-sm"
                                placeholder="Margot Foster"
                                onChange={handleChange}
                            />
                        </dd>
                    </div>

                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">Application for</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <input
                                type="text"
                                name="applicationFor"
                                readOnly
                                className="mt-1 block w-full outline-none border-b-2 border-gray-300 focus:border-fuchsia-500 sm:text-sm"
                                value={job.jobtitle}
                                onChange={handleChange}
                            />
                        </dd>
                    </div>

                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">Email address<span className='text-red-700'>*</span></dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <input
                                type="email"
                                name="email"
                                required
                                className="mt-1 block w-full outline-none border-b-2 border-gray-300 focus:border-fuchsia-500 sm:text-sm"
                                placeholder="margot.foster@example.com"
                                onChange={handleChange}
                            />
                        </dd>
                    </div>

                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">Salary expectation<span className='text-red-700'>*</span></dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <input
                                type="text"
                                name="salaryExpectation"
                                required
                                className="mt-1 block w-full outline-none border-b-2 border-gray-300 focus:border-fuchsia-500 sm:text-sm"
                                placeholder="₹2000000"
                                onChange={handleChange}
                            />
                        </dd>
                    </div>

                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">About<span className='text-red-700'>*</span></dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <textarea
                                name="about"
                                required
                                rows={5}
                                className="mt-1 block w-full outline-none border-b-2 border-gray-300 focus:border-fuchsia-500 sm:text-sm"
                                placeholder="Tell us about yourself"
                                onChange={handleChange}
                            />
                        </dd>
                    </div>

                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">Resume<span className='text-red-700'>*</span></dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <input
                                type="file"
                                name="resume"
                                accept=".pdf,.docx"
                                required
                                className="text-fuchsia-600 font-medium py-2 px-2 rounded cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </dd>
                    </div>

                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-700 sm:ml-3 sm:w-auto"
                        >
                            Apply
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
