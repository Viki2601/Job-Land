import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function Applicants() {
    const { id } = useParams();
    const [applicants, setApplicants] = useState([]);
    const url = "https://job-land-backend.onrender.com";

    const fetchApplicants = async () => {
        try {
            await axios.post(`${url}/applicantsByJobId/${id}`)
                .then(res => {
                    setApplicants(res.data);
                }).catch(e => {
                    toast.error('Something went wrong!');
                });
        } catch (error) {
            toast.error('Oops! Failed to fetch applicants details');
        }
    }

    useEffect(() => {
        fetchApplicants();
    }, [id]);

    const sendSelectionMail = async (applicant) => {
        try {
            const { _id, email, fullName, applicationFor, applicationJobId, company } = applicant;
            await axios.post(`${url}/sendSelectionMail`, {
                _id,
                email,
                fullName,
                jobTitle: applicationFor,
                applicationJobId: applicationJobId,
                company,
            })
                .then(res => {
                    if (res.data === 'pass') {
                        toast.success("Success");
                        window.location.reload();
                    } else {
                        toast.success("Something went wrong!");
                    }
                }).catch(e => {
                    toast.error("Something went wrong!");
                })
        } catch (error) {
            toast.error("Something went wrong!");
        }
    }

    const sendRejectionMail = async (applicant) => {
        try {
            const { _id, email, fullName, applicationFor, applicationJobId, company } = applicant;
            await axios.post(`${url}/sendRejectionMail`, {
                _id,
                email,
                fullName,
                jobTitle: applicationFor,
                applicationJobId: applicationJobId,
                company,
            })
                .then(res => {
                    if (res.data === 'pass') {
                        toast.success("Success");
                        window.location.reload();
                    } else {
                        toast.success("Something went wrong!");
                    }
                }).catch(e => {
                    toast.error("Something went wrong!");
                })
        } catch (error) {
            toast.error("Something went wrong!");
        }
    }

    const goBack = () => {
        window.history.back();
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg px-6 md:px-8 lg:px-10">
                <button onClick={goBack}><FaArrowLeft className='w-5 h-5 text-fuchsia-600' /></button>
                <h2 className='text-3xl text-center text-fuchsia-600 font-bold uppercase'>Applicants</h2>
                {applicants.length > 0 ? (
                    <div className="overflow-y-auto mt-5" style={{ maxHeight: '500px' }}>
                        <div className="inline-block min-w-full overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        {['Full Name', 'Email', 'Role', 'Resume', 'About', 'Action'].map((header) => (
                                            <th key={header} className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map((applicant) => (
                                        <tr key={applicant._id}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                <p className="text-gray-900 whitespace-no-wrap">{applicant.fullName}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                <p className="text-gray-900 whitespace-no-wrap">{applicant.email}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                <p className="text-gray-900 whitespace-no-wrap">{applicant.applicationFor}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                <a href={`${url}/${applicant.resumePath}`} className="text-fuchsia-600 whitespace-no-wrap">
                                                    {applicant.resumeFilename}
                                                </a>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                <p className="text-gray-900 whitespace-no-wrap">{applicant.about}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                {applicant.status === 'Accepted' ? (
                                                    <p className="text-green-600 font-bold">Accepted</p>
                                                ) : applicant.status === 'Rejected' ? (
                                                    <p className="text-red-600 font-bold">Rejected</p>
                                                ) : (
                                                    <>
                                                        <div className='m-1 flex justify-center'>
                                                            <button
                                                                onClick={() => sendSelectionMail(applicant)}
                                                                className='inline-flex items-center px-4 py-1 shadow-md rounded-lg bg-green-600 hover:bg-green-700 text-gray-100 font-semibold text-sm'>
                                                                Accept
                                                            </button>
                                                        </div>
                                                        <div className='m-1 flex justify-center'>
                                                            <button
                                                                onClick={() => sendRejectionMail(applicant)}
                                                                className='inline-flex items-center px-4 py-1 shadow-md rounded-lg bg-red-600 hover:bg-red-700 text-gray-100 font-semibold text-sm'>
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center mt-10">
                        <p className="text-center text-gray-500">No Applicants available</p>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    )
}
