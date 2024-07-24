import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { FaArrowLeft, FaIndustry } from 'react-icons/fa';


export default function SingleJobViewPage() {
    const { id } = useParams();
    const url = "https://job-land-backend.onrender.com";
    const navigate = useNavigate();
    const [job, setJob] = useState({
        company: '',
        jobtitle: '',
        description: '',
        jobLocation: '',
        qualification: '',
        jobType: '',
        numberOfPeople: '',
        experienceLevel: '',
        salary: ''
    });

    const fetchJobDetails = async () => {
        try {
            const res = await axios.post(`${url}/jobsById/${id}`);
            setJob(res.data);
        } catch (error) {
            toast.error("Oops! Failed to fetch job details");
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const handleApply = () => {
        navigate('/application', { state: { job: job } });
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 md:p-8 lg:p-10">
                <div>
                    <button onClick={goBack} className="flex items-center mb-4">
                        <FaArrowLeft className="w-5 h-5 text-fuchsia-600" />
                        <span className="ml-2 text-fuchsia-600">Back</span>
                    </button>
                    <h2 className="text-3xl font-bold text-fuchsia-500 uppercase my-2">{job.jobtitle}</h2>
                    <h3 className="text-2xl font-semibold text-fuchsia-500 uppercase my-2">{job.company}</h3>
                    <div className="mt-4">
                        <div className="flex items-center mt-2">
                            <FaIndustry className="text-fuchsia-500" />
                            <span className="ml-2 text-lg">{job.industry}</span>
                        </div>
                        <div className="mt-4">
                            <p className="font-light text-sm text-gray-600">
                                <span className="text-gray-900 font-semibold">Job Type:</span> {job.jobType}
                            </p>
                            <p className="font-light text-sm text-gray-600">
                                <span className="text-gray-900 font-semibold">Job Location:</span> {job.jobLocation} / {job.mode}
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 font-light text-sm text-gray-600">
                        <span className="text-gray-900 font-semibold">Description:</span> {job.description}
                    </p>
                    <p className="mt-4 font-light text-sm text-gray-600">
                        <span className="text-gray-900 font-semibold">Requirements:</span> {job.qualification}
                    </p>
                    <p className="mt-4 font-light text-sm text-gray-600">
                        <span className="text-gray-900 font-semibold">Experience Level:</span> {job.experienceLevel}
                    </p>
                    <p className="mt-4 font-light text-sm text-gray-600">
                        <span className="text-gray-900 font-semibold">Salary:</span> {job.salary} Lakhs per Annum
                    </p>
                    <p className="mt-4 font-light text-sm text-gray-600">
                        <span className="text-gray-900 font-semibold">Openings:</span> {job.numberOfPeople}
                    </p>
                    <div className="flex justify-center items-center mt-6">
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-700 sm:ml-3 sm:w-auto"
                            onClick={handleApply}
                        >
                            Apply now
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
