import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function Candidate() {
    const { id } = useParams();
    const [candidate, setCandidate] = useState({});
    const [appliedJobs, setAppliedJobs] = useState([]);

    const fetchCandidate = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/candidate/${id}`);
            setCandidate(res.data);
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong!");
        }
    };

    const fetchApplication = async () => {
        try {
            const cookieVal = candidate.email;
            const res = await axios.post('http://localhost:8000/appliedJobsByMail', { cookieVal });
            setAppliedJobs(res.data);
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    useEffect(() => {
        fetchCandidate();
    }, [id]);

    useEffect(() => {
        if (candidate.email) {
            fetchApplication();
        }
    }, [candidate]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const month = monthNames[date.getMonth()];
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formattedDob = formatDate(candidate.dob);

    return (
        <div className="m-5 py-5 rounded-md shadow-md">
            <h1 className="text-center uppercase text-3xl font-bold mb-5">Candidate Details</h1>
            <div className="p-10 border-b-2 flex flex-wrap">
                <div className="w-full md:w-1/2 mb-5 pr-5">
                    <h1 className="text-xl font-bold text-fuchsia-600 uppercase pb-5">{candidate.name}</h1>
                    <p className="font-bold mb-2">E-mail: <span className="font-normal">{candidate.email}</span></p>
                    <p className="font-bold mb-2">Contact: <span className="font-normal">{candidate.phone}</span></p>
                    <p className="font-bold mb-2">Date of Birth: <span className="font-normal">{formattedDob}</span></p>
                    <p className="font-bold mb-2">Location: <span className="font-normal">{candidate.city}, {candidate.state}, {candidate.country}</span></p>
                    <p className="font-bold mb-2">Description: <span className="font-normal">{candidate.about}</span></p>
                </div>
                <div className="w-full md:w-1/2 border-l-2 pl-5">
                    <h1 className="font-bold text-xl">Candidate Preference</h1>
                    <div className="py-5 border-b-2">
                        <p className="font-bold mb-2">Preferred Location: <span className="font-normal">{candidate.preferedJobLocation}</span></p>
                        <p className="font-bold mb-2">Preferred Job Type: <span className="font-normal">{candidate.preferedJobType}</span></p>
                        <p className="font-bold mb-2">Experience Level: <span className="font-normal">{candidate.experienceLevel}</span></p>
                    </div>
                    <h1 className="font-bold text-xl mt-3">Contact Details</h1>
                    <div className="py-5 flex flex-col">
                        <a href={candidate.portfolio} className="font-bold mb-2 break-all">Portfolio: <span className="font-normal text-fuchsia-600 break-all">{candidate.portfolio}</span></a>
                        <a href={candidate.gitHub} className="font-bold mb-2 break-all">GitHub: <span className="font-normal text-fuchsia-600 break-all">{candidate.gitHub}</span></a>
                        <a href={candidate.linkedin} className="font-bold mb-2 break-all">Linkedin: <span className="font-normal text-fuchsia-600 break-all">{candidate.linkedin}</span></a>
                    </div>
                </div>
            </div>
            <div className="mt-10 p-5">
                <h1 className="text-2xl text-center uppercase font-bold mb-4">Applied Jobs</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company Name
                                </th>
                                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Recruiter Name
                                </th> */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applied Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applied on
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Application Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appliedJobs.map((job) => (
                                <tr key={job._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{job.company}</div>
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{job.email}</div>
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{job.applicationFor}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatDate(job.createdAt)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {job.status === 'Accepted' ? (
                                            <p className="text-green-600 font-bold">Accepted</p>
                                        ) : job.status === 'Rejected' ? (
                                            <p className="text-red-600 font-bold">Rejected</p>
                                        ) : (
                                            <p className="text-gray-600 font-bold">Pending</p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
