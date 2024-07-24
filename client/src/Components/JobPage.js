import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaIndustry, FaPen, FaTrash, FaUser } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function JobPage() {
    const { id } = useParams();
    const [deletePopup, setDeletePopup] = useState(false);
    const [updatePopup, setUpdatePopup] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [job, setJob] = useState({
        company: '',
        jobtitle: '',
        companyLocation:'',
        services:'',
        aboutCompany:'',
        description: '',
        jobLocation: '',
        qualification: '',
        jobType: '',
        numberOfPeople: '',
        experienceLevel: '',
        salary: ''
    });
    console.log(job)

    const fetchJobDetails = async () => {
        try {
            await axios.post(`http://localhost:8000/jobsById/${id}`)
                .then(res => {
                    setJob(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!");
                });
        } catch (error) {
            toast.error("Oops! Failed to fetch job details");
        }
    }

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8000/updateJob/${id}`, job)
                .then(res => {
                    toast.success('Updated Successfully');
                    setUpdatePopup(false);
                    setOpenUpdate(false);
                }).catch(e => {
                    toast.error('Something went wrong!');
                });
        } catch (e) {
            toast.error('Oops! Failed to update details')
        }
    }

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setJob(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Deleting Courses
    const handleDeleteJob = async () => {
        try {
            console.log("try")
            const res = await axios.post(`http://localhost:8000/deleteJob/${id}`);
            console.log(res)
            if (res.data === "pass") {
                toast.success("Job removed successfully");
                setTimeout(() => {
                    setDeletePopup(false);
                    setOpenDelete(false);
                    goBack();
                }, 1000)

            } else {
                toast.error("Failed to remove!");
            }
        } catch (e) {
            console.log(e)
            toast.error("Something went wrong!");
        }
    }

    const goBack = () => {
        window.history.back();
    };

    return (
        <div className="container mx-auto p-4 mt-5">
            <div className="bg-white shadow-md rounded-lg p-6 md:p-8 lg:p-10">
                <button onClick={goBack}><FaArrowLeft className='w-5 h-5 text-fuchsia-600' /></button>
                <h2 className="text-3xl font-bold text-fuchsia-500 uppercase my-2">{job.jobtitle}</h2>
                <h3 className="text-2xl font-semibold text-fuchsia-500 uppercase my-2">{job.company}</h3>
                <div className="w-1/2">
                    <div className="flex items-center mt-2">
                        <FaIndustry className="text-fuchsia-500" />
                        <span className="ml-2 text-lg">{job.industry}</span>
                    </div>
                    <div className="mt-4">
                        <p className="mt-4 font-light text-sm text-gray-600">
                            <span className="text-gray-900 font-semibold">Job Type:</span> {job.jobType}
                        </p>
                        <p className="mt-4 font-light text-sm text-gray-600">
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
                <div className='flex justify-center items-center'>
                    <div className='m-1 flex items-center px-2 py-2 shadow-md rounded-lg'>
                        <FaPen className='text-fuchsia-600 mx-1' />
                        <button onClick={() => { setOpenUpdate(true); setUpdatePopup(true); }} className='text-gray-600 font-semibold text-sm'>Update details</button>
                    </div>
                    <div className='m-1 flex items-center px-2 py-2 shadow-md rounded-lg'>
                        <FaTrash className='text-fuchsia-600 mx-1' />
                        <button onClick={() => { setOpenDelete(true); setDeletePopup(true); }} className='text-gray-600 font-semibold text-sm'>Remove</button>
                    </div>
                    <div className='m-1 flex items-center px-2 py-2 shadow-md rounded-lg'>
                        <FaUser className='text-fuchsia-600 mx-1' />
                        <Link to={`/applicants/${id}`} className='text-gray-600 font-semibold text-sm'>View Applicants</Link>
                    </div>
                </div>
            </div>
            {deletePopup && (
                <Transition show={openDelete}>
                    <Dialog className="relative z-10" onClose={setOpenDelete}>
                        <TransitionChild
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </TransitionChild>

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <TransitionChild
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <ShieldExclamationIcon className="h-6 w-6 text-fuchsia-600" aria-hidden="true" />
                                                </div>
                                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                        Delete Post
                                                    </DialogTitle>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            Are you sure you want to delete this job post? All of your data will be permanently
                                                            removed. This action cannot be undone.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-500 sm:ml-3 sm:w-auto"
                                                onClick={() => handleDeleteJob(job._id)}
                                            >
                                                Remove
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={() => setOpenDelete(false)}
                                                data-autofocus
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}
            {updatePopup && (
                <Transition show={openUpdate}>
                    <Dialog className="relative z-10" onClose={setOpenUpdate}>
                        <TransitionChild
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </TransitionChild>

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <TransitionChild
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <form onSubmit={handleUpdate}>
                                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                        <DialogTitle as="h3" className="text-xl font-bold leading-6 text-gray-900">
                                                            Update details
                                                        </DialogTitle>
                                                        <div className='w-full py-10 flex flex-col items-center'>
                                                            <div>
                                                                <div className="border-b border-gray-900/10 pb-12" >
                                                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                                                        <div className="sm:col-span-3">
                                                                            <label htmlFor="company" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                Company's Name
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    type="text"
                                                                                    name="company"
                                                                                    readOnly
                                                                                    onChange={handleUpdateChange}
                                                                                    value={job.company}
                                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-3">
                                                                            <label htmlFor="jobtitle" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                Job title
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    type="text"
                                                                                    name="jobtitle"
                                                                                    readOnly
                                                                                    onChange={handleUpdateChange}
                                                                                    value={job.jobtitle}
                                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-3">
                                                                            <label htmlFor="companyLocation" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                Company Location
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    type="text"
                                                                                    name="companyLocation"
                                                                                    // readOnly
                                                                                    onChange={handleUpdateChange}
                                                                                    value={job.companyLocation}
                                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-3">
                                                                            <label htmlFor="services" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                Our Services
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    type="text"
                                                                                    name="services"
                                                                                    // readOnly
                                                                                    onChange={handleUpdateChange}
                                                                                    value={job.services}
                                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-full">
                                                                            <label htmlFor="aboutCompany" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                Company description
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <textarea
                                                                                    name="aboutCompany"
                                                                                    rows={4}
                                                                                    onChange={handleUpdateChange}
                                                                                    value={job.aboutCompany}
                                                                                    className="w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                                                ></textarea>
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-full">
                                                                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                Job description
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <textarea
                                                                                    name="description"
                                                                                    rows={4}
                                                                                    onChange={handleUpdateChange}
                                                                                    value={job.description}
                                                                                    className="w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                                                ></textarea>
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-3">
                                                                            <label htmlFor="jobLocation" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                Job Location
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    type="text"
                                                                                    name="jobLocation"
                                                                                    onChange={handleUpdateChange}
                                                                                    value={job.jobLocation}
                                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-4 sm:text-sm sm:leading-6"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-3">
                                                                            <label htmlFor="qualification" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                Qualification
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    type="text"
                                                                                    name="qualification"
                                                                                    onChange={handleUpdateChange}
                                                                                    value={job.qualification}
                                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-4 sm:text-sm sm:leading-6"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-3 sm:col-start-1">
                                                                            <label htmlFor="jobType" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                Job Type
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <select
                                                                                    name="jobType"
                                                                                    onChange={handleUpdateChange}
                                                                                    value={job.jobType}
                                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6"
                                                                                >
                                                                                    <option value="" disabled selected>Select type</option>
                                                                                    <option value={'Full-Time'}>Full-Time</option>
                                                                                    <option value={'Permanent'}>Permanent</option>
                                                                                    <option value={'Fresher'}>Fresher</option>
                                                                                    <option value={'Internship'}>Internship</option>
                                                                                    <option value={'Freelance'}>Freelance</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-3">
                                                                            <label htmlFor="numberOfPeople" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                Number of vacancies
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <select
                                                                                    name="numberOfPeople"
                                                                                    onChange={handleUpdateChange}
                                                                                    value={job.numberOfPeople}
                                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6"
                                                                                >
                                                                                    <option value="" disabled selected>Select an option</option>
                                                                                    <option value={'1'}>1</option>
                                                                                    <option value={'2'}>2</option>
                                                                                    <option value={'3'}>3</option>
                                                                                    <option value={'4'}>4</option>
                                                                                    <option value={'5'}>5</option>
                                                                                    <option value={'6'}>6</option>
                                                                                    <option value={'7'}>7</option>
                                                                                    <option value={'8'}>8</option>
                                                                                    <option value={'9'}>9</option>
                                                                                    <option value={'10'}>10</option>
                                                                                    <option value={'10+'}>10+</option>
                                                                                    <option value={'I have an ongoing need to fill this role'}>I have an ongoing need to fill this role</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-3">
                                                                            <label htmlFor="experienceLevel" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                Experience Level
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <select
                                                                                    name="experienceLevel"
                                                                                    onChange={handleUpdateChange}
                                                                                    value={job.experienceLevel}
                                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6"
                                                                                >
                                                                                    <option value="" disabled selected>Select experience</option>
                                                                                    <option value={'0-1 years'}>0-1 years</option>
                                                                                    <option value={'1-3 years'}>1-3 years</option>
                                                                                    <option value={'3-5 years'}>3-5 years</option>
                                                                                    <option value={'5+ years'}>5+ years</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:col-span-3">
                                                                            <label htmlFor="salary" className="block text-sm font-medium leading-6 text-gray-900">
                                                                                Pay (In Lakhs Per Annum)
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <select
                                                                                    name="salary"
                                                                                    onChange={handleUpdateChange}
                                                                                    value={job.salary}
                                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6"
                                                                                >
                                                                                    <option value="" disabled selected>Select an option</option>
                                                                                    <option value={'0-1'}>0-1</option>
                                                                                    <option value={'1-2'}>1-2</option>
                                                                                    <option value={'2-3'}>2-3</option>
                                                                                    <option value={'3-4'}>3-4</option>
                                                                                    <option value={'5+'}>5+</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div >
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                <button
                                                    type="submit"
                                                    className="inline-flex w-full justify-center rounded-md bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-500 sm:ml-3 sm:w-auto"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                    onClick={() => setOpenUpdate(false)}
                                                    data-autofocus
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </DialogPanel>
                                    </form>
                                </TransitionChild>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}
        </div>
    )
}
