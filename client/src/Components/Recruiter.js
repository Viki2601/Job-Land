import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function Recruiter() {
    const { id } = useParams();
    const [recruiter, setRecruiter] = useState({});
    const [postedJobs, setPostedJobs] = useState([]);
    console.log(postedJobs)
    const company = postedJobs.map((e) => (e.company));
    const about = postedJobs.map((e) => (e.aboutCompany));
    const services = postedJobs.map((e) => (e.services));
    const location = postedJobs.map((e) => (e.companyLocation));

    console.log(company.at(0))





    const fetchRecruiter = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/recruiter/${id}`);
            setRecruiter(res.data);
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong!");
        }
    };
    useEffect(() => {
        fetchRecruiter();
    }, [id]);

    const fetchJobs = async () => {
        try {
            const cookieVal = recruiter.email;
            const res = await axios.post('http://localhost:8000/jobsByMail', { cookieVal });
            setPostedJobs(res.data);
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };
    useEffect(() => {
        if (recruiter.email) {
            fetchJobs();
        }
    }, [recruiter]);

    return (
        <div className="m-5 py-5 rounded-md shadow-md">
            <h1 className="text-center uppercase text-3xl font-bold mb-5">Recruiter Details</h1>
            <div className="p-10 border-b-2 flex flex-wrap">
                <div className="w-full md:w-1/2 mb-5 pr-5">
                    <h1 className="text-xl font-bold text-fuchsia-600 uppercase pb-5">{recruiter.name}</h1>
                    <p className="font-bold mb-2">E-mail: <span className="font-normal">{recruiter.email}</span></p>
                    <p className="font-bold mb-2">Contact: <span className="font-normal">{recruiter.phone}</span></p>
                    <p className="font-bold mb-2">Location: <span className="font-normal">{recruiter.city}, {recruiter.state}, {recruiter.country}</span></p>
                    <p className="font-bold mb-2">Description: <span className="font-normal">{recruiter.about}</span></p>
                </div>
                <div className="w-full md:w-1/2 border-l-2 pl-5">
                    <p className="font-bold text-xl uppercase text-fuchsia-600 mb-2">{company.at(0)}</p>
                    <div className="py-3">
                        <p className="font-bold mb-2"><span className="font-normal">{about.at(0)}</span></p>
                        <p className="font-bold mb-2">Our Services: <span className="font-normal">{services.at(0)}</span></p>
                        <p className="font-bold mb-2">Our Location: <span className="font-normal">{location.at(0)}</span></p>
                        <p className="font-bold mb-2">Our Website: <span className="font-normal">www.xxxxxxxxxxxxx.com</span></p>

                    </div>
                </div>
            </div>
            <div className="mt-10 p-5">
                <h1 className="text-2xl text-center uppercase font-bold mb-4">Posted Jobs</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job Title
                                </th>

                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Work mode
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Openings
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Qualification
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {postedJobs.map((job) => (
                                <tr key={job._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{job.jobtitle}</div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{job.mode}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{job.jobLocation}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{job.jobType}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{job.numberOfPeople}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{job.qualification}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
