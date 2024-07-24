import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaGraduationCap, FaChalkboardTeacher, FaHome, FaBriefcase, FaCog } from 'react-icons/fa';
import { FaWpforms } from 'react-icons/fa6';
import 'react-toastify/dist/ReactToastify.css';
import Graph from './Graph';
import GraphJobs from './GraphJobs';
import { Link } from 'react-router-dom';


export default function AdminAccount() {
    // Fetching Admin Mail from cookies
    const [cookieVal] = useState(Cookies.get('email'));

    // Storing the admin details
    const [adminDetails, setAdminDetails] = useState('');

    // Storing the recently posted 10 jobs
    const [recentJobs, setRecentJobs] = useState([]);

    // Menu sections for view
    const [candidatesMenu, setCandidatesMenu] = useState(false);
    const [updateProfileMenu, setUpdateProfileMenu] = useState(false);
    const [recruitersMenu, setRecruitersMenu] = useState(false);
    const [profileMenu, setProfileMenu] = useState(true);
    const [isOpen, setIsOpen] = useState(false);


    // Count details to display in main menu
    const [applicantDetails, setApplicantDetails] = useState([]);
    const [applicantCount, setApplicantCount] = useState(0);
    const [employerDetails, setEmployerDetails] = useState([]);
    const [employerCount, setEmployerCount] = useState(0);
    const [applicationCount, setApplicationCount] = useState(0);
    const [jobsCount, setJobsCount] = useState(0);
    const recruiterEmail = employerDetails.email;
    const [jobList, setJobList] = useState([]);


    // Graphical data storing 
    const [graphData, setGraphData] = useState([]);
    const [jobGraphData, setJobGraphData] = useState([]);

    const admin = async () => {
        try {
            await axios.post("https://job-land-backend.onrender.com/userAccount", { cookieVal })
                .then(res => {
                    setAdminDetails(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!");
                });
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    const applicant = async () => {
        try {
            await axios.get("https://job-land-backend.onrender.com/applicant", { params: { role: "jobSeeker" } })
                .then(res => {
                    setApplicantDetails(res.data);
                    setApplicantCount(res.data.length);
                }).catch(e => {
                    toast.error("Something went wrong!");
                })
        } catch (e) {
            toast.error("Something went wrong!");
        };
    };

    const recruiter = async () => {
        try {
            await axios.get("https://job-land-backend.onrender.com/recruiter", { params: { role: "employer" } })
                .then(res => {
                    setEmployerDetails(res.data)
                    setEmployerCount(res.data.length);
                }).catch(e => {
                    toast.error("Something went wrong!");
                })
        } catch (e) {
            toast.error("Something went wrong!");
        };
    };

    const application = async () => {
        try {
            await axios.get("https://job-land-backend.onrender.com/application")
                .then(res => {
                    setApplicationCount(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!");
                })
        } catch (e) {
            toast.error("Something went wrong!");
        };
    };

    const jobs = async () => {
        try {
            await axios.get("https://job-land-backend.onrender.com/jobs")
                .then(res => {
                    setJobsCount(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!");
                })
        } catch (e) {
            toast.error("Something went wrong!");
        };
    };

    const fetchGraphData = async () => {
        try {
            const res = await axios.get("https://job-land-backend.onrender.com/graphData");
            setGraphData(res.data);
        } catch (e) {
            console.log(e)
            toast.error("Something went wrong!");
        }
    };

    const fetchJobGraphData = async () => {
        try {
            const res = await axios.get("https://job-land-backend.onrender.com/jobGraphData");
            setJobGraphData(res.data);
        } catch (e) {
            console.log(e)
            toast.error("Something went wrong!");
        }
    };

    const fetchRecentJobs = async () => {
        try {
            const res = await axios.get("https://job-land-backend.onrender.com/recentJobs");
            setRecentJobs(res.data);
        } catch (e) {
            toast.error("Something went wrong!");
        };
    };

    const recruiterJobs = async () => {
        try {
            await axios.post("https://job-land-backend.onrender.com/jobsByMail", { recruiterEmail })
                .then(res => {
                    setJobList(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!");
                });
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    useEffect(() => {
        admin();
        applicant();
        recruiter();
        application();
        jobs();
        fetchGraphData();
        fetchJobGraphData();
        fetchRecentJobs();
    }, [cookieVal]);



    const handleUpdateChange = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://job-land-backend.onrender.com/updateProfile', adminDetails)
                .then(res => {
                    toast.success('Profile updated Successfully');
                    setUpdateProfileMenu(false);
                    setProfileMenu(true);
                }).catch(e => {
                    toast.error('Something went wrong!');
                });
        } catch (e) {
            toast.error('Oops! Failed to update profile');
        }
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const logout = () => {
        Cookies.remove('email');
        toast.success("Logged out successfully!");
    };

    const handleReload = () => {
        window.location.reload();
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };


    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <div className='flex flex-col md:flex-row min-h-screen'>
            {/* Sidebar */}
            <button
                className="md:hidden p-4 focus:outline-none"
                onClick={toggleSidebar}
            >
                <svg
                    className="w-6 h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-white text-white fixed shadow-md w-64 p-4 flex flex-col h-full lg:h-auto`}>
                <a href='/' className="text-fuchsia-600 font-bold text-2xl md:text-3xl uppercase cursor-pointer">
                    Job<span className="text-gray-900">Land</span>
                </a>
                <div className="flex-grow p-4">
                    <nav className="flex flex-col space-y-4 lg:block min-h-screen">
                        <ul>
                            <li className="mb-4 border-b-2">
                                <button onClick={() => { handleLinkClick(); handleReload(); setUpdateProfileMenu(false); setProfileMenu(true); setCandidatesMenu(false); setRecruitersMenu(false); }} className="flex items-center pb-4 text-gray-900 hover:font-bold">
                                    <FaHome className="mr-2" />
                                    Home
                                </button>
                            </li>
                            <li className="mb-4">
                                <button onClick={() => { handleLinkClick(); setUpdateProfileMenu(false); setProfileMenu(false); setCandidatesMenu(true); setRecruitersMenu(false); }} className="flex items-center text-gray-900 hover:font-bold">
                                    <FaGraduationCap className="mr-2" />
                                    Candidates
                                </button>
                            </li>
                            <li className="mb-4 border-b-2">
                                <button onClick={() => { handleLinkClick(); setUpdateProfileMenu(false); setProfileMenu(false); setCandidatesMenu(false); setRecruitersMenu(true); }} className="flex items-center pb-4 text-gray-900 hover:font-bold">
                                    <FaChalkboardTeacher className="mr-2" />
                                    Recruiters
                                </button>
                            </li>
                            <li className="mb-4">
                                <button onClick={() => { handleLinkClick(); setUpdateProfileMenu(true); setProfileMenu(false); setCandidatesMenu(false); setRecruitersMenu(false); }} className="flex items-center text-gray-900 hover:font-bold">
                                    <FaCog className="mr-2" />
                                    Update Profile
                                </button>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <button onClick={logout} className="text-fuchsia-600 uppercase text-sm font-bold">Logout</button>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className='w-full lg:mt-0 sm:mt-24'>
                {/* Default profile section */}
                {profileMenu && (
                    <div>
                        <div className='w-full p-5 flex justify-between items-center lg:items-center lg:pl-10 border'>
                            <div>
                                <h1 className='text-3xl font-bold'>Dashboard</h1>
                            </div>
                            <div className='space-x-4'>
                                <h3 className='text-sm font-semibold text-fuchsia-600'>{adminDetails.name}</h3>
                            </div>
                        </div>


                        <div className="m-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="p-4 flex items-center text-gray-900 font-semibold border shadow-md rounded">
                                <FaGraduationCap className='mr-2 text-fuchsia-600 text-6xl' />
                                <div className='ml-2'>
                                    <h1 className='text-sm uppercase font-bold'>Applicants</h1>
                                    <div className='text-3xl'>{applicantCount}</div>
                                </div>
                            </div>
                            <div className="p-4 flex items-center text-gray-900 font-semibold border shadow-md rounded">
                                <FaChalkboardTeacher className='mr-2 text-fuchsia-600 text-6xl' />
                                <div className='ml-2'>
                                    <h1 className='text-sm uppercase font-bold'>Recruiters</h1>
                                    <div className='text-3xl'>{employerCount}</div>
                                </div>
                            </div>
                            <div className="p-4 flex items-center text-gray-900 font-semibold border shadow-md rounded">
                                <FaWpforms className='mr-2 text-fuchsia-600 text-6xl' />
                                <div className='ml-2'>
                                    <h1 className='text-sm uppercase font-bold'>Applications</h1>
                                    <div className='text-3xl'>{applicationCount}</div>
                                </div>
                            </div>
                            <div className="p-4 flex items-center text-gray-900 font-semibold border shadow-md rounded">
                                <FaBriefcase className='mr-2 text-fuchsia-600 text-6xl' />
                                <div className='ml-2'>
                                    <h1 className='text-sm uppercase font-bold'>Jobs</h1>
                                    <div className='text-3xl'>{jobsCount}</div>
                                </div>
                            </div>
                        </div>

                        {/* Graph Section */}
                        <div className='mt-10 lg:flex w-full'>
                            <div className='my-5 px-5 mt-10 w-full border-r border-b'>
                                <h2 className='text-2xl text-center font-bold mb-4'>Applications Activity</h2>
                                <Graph data={graphData} />
                            </div>
                            <div className='my-5 px-5 mt-10 w-full border-b'>
                                <h2 className='text-2xl text-center font-bold mb-4'>Posted Jobs</h2>
                                <GraphJobs data={jobGraphData} />
                            </div>
                        </div>

                        <div className="mt-10 p-5">
                            <h1 className="text-2xl text-center font-bold mb-4">Recently Posted Jobs</h1>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Company
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Job Type
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Industry
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Posted Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentJobs.map((job) => (
                                            <tr key={job._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{job.company}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{job.jobtitle}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{job.jobType}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{job.industry}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(job.postedDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {candidatesMenu && (
                    <div>
                        <div className="mt-10 p-5">
                            <h1 className="text-2xl text-center font-bold mb-4">Candidates details</h1>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Full Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                E-mail
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Information
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {applicantDetails.map((applicant) => (
                                            <tr key={applicant._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{applicant.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{applicant.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{applicant.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{applicant.city},{applicant.state},{applicant.country}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link to={`/candidate/${applicant._id}`} className="text-sm text-fuchsia-600">More info</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {recruitersMenu && (
                    <div>
                        <div className="mt-10 p-5">
                            <h1 className="text-2xl text-center font-bold mb-4">Recruiters details</h1>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Full Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                E-mail
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Information
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {employerDetails.map((employer) => (
                                            <tr key={employer._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{employer.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{employer.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{employer.phone}</div>
                                                </td>
                                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{jobList.company}</div>
                                                </td> */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link to={`/recruiter/${employer._id}`} className="text-sm text-fuchsia-600">More info</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {/* Update profile section */}
                {updateProfileMenu && (
                    <form onSubmit={handleUpdateChange}>
                        <div className='w-full py-10 flex flex-col items-center'>
                            <div className='lg:w-1/2 flex justify-evenly items-center rounded-lg bg-stone-50'>
                                <div>
                                    <h2 className='font-bold text-2xl text-fuchsia-600'>Update your Profile</h2>
                                </div>
                                <div>
                                    <img className='h-40' src={require('./images/settings.webp')} />
                                </div>
                            </div>
                            <div className='w-1/2'>
                                <div className="border-b border-gray-900/10 pb-12" >
                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                Full Name  <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    onChange={handleInputChange}
                                                    value={adminDetails.name}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                E-mail  <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    onChange={handleInputChange}
                                                    value={adminDetails.email}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                                Contact
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    onChange={handleInputChange}
                                                    value={adminDetails.phone}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="dob" className="block text-sm font-medium leading-6 text-gray-900">
                                                Date of Birth
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    onChange={handleInputChange}
                                                    value={adminDetails.dob}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="dob" className="block text-sm font-medium leading-6 text-gray-900">
                                                Gender
                                            </label>
                                            <div className="mt-2 flex items-center gap-10">
                                                <label htmlFor="genderMale" className="block text-sm font-medium leading-6 text-gray-900">
                                                    <input id='genderMale' name='gender' value='male' type='radio' checked={adminDetails.gender === 'male'} onChange={handleInputChange} />Male
                                                </label>
                                                <label htmlFor="genderFemale" className="block text-sm font-medium leading-6 text-gray-900">
                                                    <input id='genderFemale' name='gender' value='female' type='radio' checked={adminDetails.gender === 'female'} onChange={handleInputChange} />Female
                                                </label>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                                City
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="city"
                                                    onChange={handleInputChange}
                                                    value={adminDetails.city}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                                                State
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="state"
                                                    onChange={handleInputChange}
                                                    value={adminDetails.state}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                                Country
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="country"
                                                    onChange={handleInputChange}
                                                    value={adminDetails.country}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-full">
                                            <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                                About <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <textarea
                                                    name="about"
                                                    required
                                                    rows={4}
                                                    onChange={handleInputChange}
                                                    value={adminDetails.about}
                                                    className="w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-full">
                                            <label htmlFor="portfolio" className="block text-sm font-medium leading-6 text-gray-900">
                                                Portfolio
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="portfolio"
                                                    onChange={handleInputChange}
                                                    value={adminDetails.portfolio}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-full">
                                            <label htmlFor="gitHub" className="block text-sm font-medium leading-6 text-gray-900">
                                                GitHub
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="gitHub"
                                                    onChange={handleInputChange}
                                                    value={adminDetails.gitHub}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-full">
                                            <label htmlFor="linkedin" className="block text-sm font-medium leading-6 text-gray-900">
                                                Linkedin
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="linkedin"
                                                    onChange={handleInputChange}
                                                    value={adminDetails.linkedin}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </div>
                            <button type='submit' className="mt-6 bg-fuchsia-600 text-white py-2 px-4 rounded">Update</button>
                        </div>
                    </form>
                )}

            </div>



            {/* Toast Notifications */}
            <ToastContainer />
        </div>
    )
}
