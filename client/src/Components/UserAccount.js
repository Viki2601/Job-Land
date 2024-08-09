import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaHistory, FaGlobe, FaChartBar, FaCog, FaEnvelope, FaPhoneAlt, FaSearch, FaIndustry, FaGithub, FaLinkedinIn, FaBriefcase, FaFilePdf, FaEye } from 'react-icons/fa';
import { MdDashboard, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";


export default function UserAccount() {
    const [cookieVal] = useState(Cookies.get('email'));
    const [selectedTab, setSelectedTab] = useState('applied');
    const url = "https://job-land-backend.onrender.com";
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [profileMenu, setProfileMenu] = useState(true);
    const [employerMenu, setEmployerMenu] = useState(false);
    const [jobListMenu, setJobListMenu] = useState(false);
    const [myJobListMenu, setMyJobListMenu] = useState(false);
    const [updateProfileMenu, setUpdateProfileMenu] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        setAnimate(true);
    }, []);

    // Fetched data's value 
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        role: '',
        city: '',
        state: '',
        country: '',
        about: '',
        portfolio: '',
        gitHub: '',
        linkedin: '',
        preferedJobLocation: '',
        preferedJobType: '',
        experienceLevel: '',
        expectedSalary: '',
        resumePath: '',
        resumeFilename: '',
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [jobList, setJobList] = useState([]);
    const [appliedJobList, setAppliedJobList] = useState([]);
    const [savedJobList, setSavedJobList] = useState([]);


    const [formData, setFormData] = useState({
        industry: '',
        mode: '',
        company: '',
        jobtitle: '',
        companyLocation: '',
        services: '',
        aboutCompany: '',
        description: '',
        jobLocation: '',
        qualification: '',
        jobType: '',
        numberOfPeople: '',
        experienceLevel: '',
        salary: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${url}/postJobs`, { formData, cookieVal })
                .then(res => {
                    if (res.data === "pass") {
                        toast.success("Job added Successfully");

                    } else if (res.data === "fail") {
                        toast.error("Something went Wrong!");
                    }
                }).catch(e => {
                    toast.error("Something went Wrong!");
                })
        } catch (e) {
            toast.error("Something went Wrong!");
        }
        setFormData({
            industry: '',
            mode: '',
            company: '',
            jobtitle: '',
            companyLocation: '',
            services: '',
            aboutCompany: '',
            description: '',
            jobLocation: '',
            qualification: '',
            jobType: '',
            numberOfPeople: '',
            experienceLevel: '',
            salary: '',

        })
    }

    const user = async () => {
        try {
            await axios.post(`${url}/userAccount`, { cookieVal })
                .then(res => {
                    setUserDetails(res.data.check);
                    setProfileCompletion(res.data.profileCompletion);
                }).catch(e => {
                    toast.error("Something went wrong!");
                });
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };


    const jobs = async () => {
        try {
            await axios.post(`${url}/jobsByMail`, { cookieVal })
                .then(res => {
                    setJobList(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!");
                });
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };


    const appliedJobs = async () => {
        try {
            await axios.post(`${url}/appliedJobsByMail`, { cookieVal })
                .then(res => {
                    setAppliedJobList(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!");
                });
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };


    const savedJobs = async () => {
        try {
            await axios.post(`${url}/savedJobsByMail`, { cookieVal })
                .then(res => {
                    setSavedJobList(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!");
                });
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    useEffect(() => {
        user();
        jobs();
        appliedJobs();
        savedJobs();
    }, [cookieVal]);




    const handleUpdateChange = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(userDetails).forEach(key => {
            formData.append(key, userDetails[key]);
        });
        if (resumeFile) {
            formData.append('resume', resumeFile);
        }
        try {
            await axios.post(`${url}/updateProfile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
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
        setUserDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const logout = () => {
        Cookies.remove('email');
        window.location.href = '/login';
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };


    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <div className='flex flex-col md:flex-row min-h-screen'>
            {/* SideBar Navigation section */}
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
                            <li className="mb-4">
                                <button onClick={() => { handleLinkClick(); setProfileMenu(true); setEmployerMenu(false); setJobListMenu(false); setMyJobListMenu(false); setUpdateProfileMenu(false) }} className="flex items-center text-gray-900 hover:font-bold">
                                    <MdDashboard className="mr-2" />
                                    Dashboard
                                </button>
                            </li>
                            <li className="mb-4">
                                <Link to={"/jobList"} className="flex items-center text-gray-900 hover:font-bold">
                                    <FaSearch className="mr-2" />
                                    Search Jobs
                                </Link>
                            </li>
                            <li className="mb-4">
                                <button onClick={() => { handleLinkClick(); setMyJobListMenu(true); setEmployerMenu(false); setProfileMenu(false); setJobListMenu(false); setUpdateProfileMenu(false); }} className="flex items-center text-gray-900 hover:font-bold">
                                    <FaHistory className="mr-2" />
                                    My Jobs
                                </button>
                            </li>
                            <li className="mb-4">
                                <button onClick={() => { handleLinkClick(); setEmployerMenu(true); setProfileMenu(false); setJobListMenu(false); setMyJobListMenu(false); setUpdateProfileMenu(false); }} className="flex items-center text-gray-900 hover:font-bold">
                                    <FaGlobe className="mr-2" />
                                    Employer/Post Job
                                </button>
                            </li>
                            <li className="mb-4">
                                <button onClick={() => { handleLinkClick(); setJobListMenu(true); setEmployerMenu(false); setProfileMenu(false); setMyJobListMenu(false); setUpdateProfileMenu(false); }} className="flex items-center text-gray-900 hover:font-bold">
                                    <FaChartBar className="mr-2" />
                                    Posted Job List
                                </button>
                            </li>
                            <li className="mb-4">
                                <button onClick={() => { handleLinkClick(); setUpdateProfileMenu(true); setEmployerMenu(false); setProfileMenu(false); setJobListMenu(false); setMyJobListMenu(false); }} className="flex items-center text-gray-900 hover:font-bold">
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


            {/* Main Content and Body Section */}
            <div className='w-full lg:mt-0 sm:mt-24'>
                {/* Default Profile view Section */}
                {profileMenu && (
                    <div className='w-full py-10 flex flex-col lg:flex-row items-center lg:items-start lg:pl-10 border'>
                        <div className='lg:w-1/2 lg:px-4 px-4 border-r'>
                            <h1 className='sm:text-4xl text-3xl mb-4 font-bold uppercase text-gray-900'>{userDetails.name}</h1>
                            <div className='w-full flex justify-start'>
                                <div className="w-full py-4">
                                    <h1 className="text-xl font-bold">Profile Progress</h1>
                                    <p className="text-gray-600 mb-4">{Math.round(profileCompletion)}% Complete</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                        <div
                                            className="bg-fuchsia-600 h-2 rounded-full"
                                            style={{ width: `${profileCompletion}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-5 flex items-center text-gray-500'>
                                <FaEnvelope />
                                <p className='ml-3'>{userDetails.email}</p>
                            </div>
                            <div className='mb-5 flex items-center text-gray-500'>
                                <FaPhoneAlt />
                                <p className='ml-3'>{userDetails.phone}</p>
                            </div>
                            <div className='mb-5 flex items-center text-gray-500'>
                                <FaLocationDot />
                                <p className='ml-3'>{userDetails.city},{" "}{userDetails.state},{" "}{userDetails.country}</p>
                            </div>
                            <div>
                                <h3 className='text-lg font-semibold'>About</h3>
                                <p className='w-full text-gray-500 font-light text-sm'>{userDetails.about}</p>
                                <div className='flex flex-col mt-4'>
                                    <div className='flex items-center py-2'>
                                        <FaBriefcase className='text-fuchsia-600' />
                                        <a href={userDetails.portfolio} target='_blank' className='break-all px-2 font-light text-sm'>{userDetails.portfolio}</a>
                                    </div>
                                    <div className='flex items-center py-2'>
                                        <FaGithub className='text-fuchsia-600' />
                                        <a href={userDetails.gitHub} target='_blank' className='break-all px-2 font-light text-sm'>{userDetails.gitHub}</a>
                                    </div>
                                    <div className='flex items-center py-2'>
                                        <FaLinkedinIn className='text-fuchsia-600' />
                                        <a href={userDetails.linkedin} target='_blank' className='break-all px-2 font-light text-sm'>{userDetails.linkedin}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='lg:w-1/2 lg:px-4 px-4 mt-10 lg:mt-0'>
                            {userDetails.resumePath && (
                                <div className='mt-4 lg:w-3/4'>
                                    <h3 className='text-lg font-semibold'>Resume</h3>
                                    <a href={`${url}/${userDetails.resumePath}`}>
                                        <div className='border rounded-lg p-4 shadow-md'>
                                            <div className='flex items-center'>
                                                <FaFilePdf className='text-fuchsia-600 text-4xl' />
                                                <div className='ml-4'>
                                                    <h4 className='text-md font-semibold'>{userDetails.resumeFilename}</h4>
                                                    <p className='text-gray-500'>Added Apr 26, 2024</p>
                                                    <div className='flex items-center text-gray-500'>
                                                        <FaEye className='mr-1' /> Searchable
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* Become an employer view Section */}
                {employerMenu && (
                    <form onSubmit={handleSubmit}>
                        <div className='w-full py-10 flex flex-col items-center'>
                            <div className='lg:w-1/2 flex justify-evenly items-center rounded-lg bg-stone-50'>
                                <div>
                                    <h2 className='font-bold text-2xl text-fuchsia-600'>Add job basics</h2>
                                </div>
                                <div>
                                    <img className='h-40' src={require('./images/employer.png')} />
                                </div>
                            </div>
                            <div>
                                <div className="border-b border-gray-900/10 pb-12" >
                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label htmlFor="industry" className="block text-sm font-medium leading-6 text-gray-900">
                                                Company's Industry <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    name="industry"
                                                    required
                                                    onChange={handleChange}
                                                    value={formData.industry}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6"
                                                >
                                                    <option value="" disabled selected>Select an industry</option>
                                                    <option>Areospace & Defense</option>
                                                    <option>Arts, Entertainment & Recreation</option>
                                                    <option>Engineering</option>
                                                    <option>Human Resources & Staffing</option>
                                                    <option>Information Technology</option>
                                                    <option>Manufacturing</option>
                                                    <option>Telecommunications</option>
                                                    <option>Tourism</option>
                                                    <option>Transportation</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="mode" className="block text-sm font-medium leading-6 text-gray-900">
                                                Which option best describes this job's location?<span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    name="mode"
                                                    required
                                                    onChange={handleChange}
                                                    value={formData.mode}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6"
                                                >
                                                    <option value="" disabled selected>Select an option</option>
                                                    <option>On-site</option>
                                                    <option>Remote</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="company" className="block text-sm font-medium leading-6 text-gray-900">
                                                Company's Name  <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="company"
                                                    required
                                                    onChange={handleChange}
                                                    value={formData.company}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="jobtitle" className="block text-sm font-medium leading-6 text-gray-900">
                                                Job title  <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="jobtitle"
                                                    required
                                                    onChange={handleChange}
                                                    value={formData.jobtitle}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="companyLocation" className="block text-sm font-medium leading-6 text-gray-900">
                                                Company Location  <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="companyLocation"
                                                    required
                                                    onChange={handleChange}
                                                    value={formData.companyLocation}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="services" className="block text-sm font-medium leading-6 text-gray-900">
                                                Our Services   <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="services"
                                                    required
                                                    onChange={handleChange}
                                                    value={formData.services}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-full">
                                            <label htmlFor="aboutCompany" className="block text-sm font-medium leading-6 text-gray-900">
                                                Company description <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <textarea
                                                    name="aboutCompany"
                                                    required
                                                    rows={4}
                                                    onChange={handleChange}
                                                    value={formData.aboutCompany}
                                                    className="w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-full">
                                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                                Job description <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <textarea
                                                    name="description"
                                                    required
                                                    rows={4}
                                                    onChange={handleChange}
                                                    value={formData.description}
                                                    className="w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="jobLocation" className="block text-sm font-medium leading-6 text-gray-900">
                                                Job Location <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="jobLocation"
                                                    required
                                                    onChange={handleChange}
                                                    value={formData.jobLocation}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-4 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="qualification" className="block text-sm font-medium leading-6 text-gray-900">
                                                Qualification <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="qualification"
                                                    required
                                                    onChange={handleChange}
                                                    value={formData.qualification}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-4 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3 sm:col-start-1">
                                            <label htmlFor="jobType" className="block text-sm font-medium leading-6 text-gray-900">
                                                Job Type <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    name="jobType"
                                                    required
                                                    onChange={handleChange}
                                                    value={formData.jobType}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6"
                                                >
                                                    <option value="" disabled selected>Select type</option>
                                                    <option>Full-Time</option>
                                                    <option>Permanent</option>
                                                    <option>Fresher</option>
                                                    <option>Internship</option>
                                                    <option>Freelance</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="numberOfPeople" className="block text-sm font-medium leading-6 text-gray-900">
                                                Number of vacancies <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    name="numberOfPeople"
                                                    required
                                                    onChange={handleChange}
                                                    value={formData.numberOfPeople}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6"
                                                >
                                                    <option value="" disabled selected>Select an option</option>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                    <option>6</option>
                                                    <option>7</option>
                                                    <option>8</option>
                                                    <option>9</option>
                                                    <option>10</option>
                                                    <option>10+</option>
                                                    <option>I have an ongoing need to fill this role</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="experienceLevel" className="block text-sm font-medium leading-6 text-gray-900">
                                                Experience Level <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    name="experienceLevel"
                                                    required
                                                    onChange={handleChange}
                                                    value={formData.experienceLevel}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6"
                                                >
                                                    <option value="" disabled selected>Select experience</option>
                                                    <option>0-1 year</option>
                                                    <option>1-3 years</option>
                                                    <option>3-5 years</option>
                                                    <option>5+ years</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="salary" className="block text-sm font-medium leading-6 text-gray-900">
                                                Pay (In Lakhs Per Annum)  <span className='text-red-700'>*</span>
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    name="salary"
                                                    required
                                                    onChange={handleChange}
                                                    value={formData.salary}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6"
                                                >
                                                    <option value="" disabled selected>Select an option</option>
                                                    <option>0-1</option>
                                                    <option>1-2</option>
                                                    <option>2-3</option>
                                                    <option>3-4</option>
                                                    <option>5+</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </div>
                            <button type='submit' className="mt-6 bg-fuchsia-600 text-white py-2 px-4 rounded">Post Job</button>
                        </div>
                    </form>
                )}
                {/* Joblist section posted by employer */}
                {jobListMenu && (
                    <div className="bg-white py-10 sm:py-10">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className={`mx-auto mb-10 ${animate ? 'animate-slideUp' : ''}`}>
                                <h2 className="text-5xl font-bold leading-7 text-fuchsia-600 uppercase text-center">Jobs</h2>
                            </div>
                            {jobList.length > 0 ? (
                                <div className={`flex flex-wrap -m-4 ${animate ? 'animate-slideUp' : ''}`}>
                                    {jobList.map((job) => (
                                        <div key={job._id} className="p-4 lg:w-1/2 md:w-full w-full">
                                            <div className="flex flex-col border-2 rounded-lg border-gray-200 border-opacity-50 p-8 h-full overflow-hidden">
                                                <div className="flex-grow">
                                                    <h3 className="text-2xl font-semibold text-fuchsia-500 hover:text-fuchsia-600">{job.jobtitle}</h3>
                                                    {/* <div className="flex items-center mt-2">
                                                        <FaIndustry className="text-gray-500" />
                                                        <span className="ml-2 text-lg">{job.industry}</span>
                                                    </div> */}
                                                    <div className="flex flex-wrap items-center mt-4">
                                                        <span className="bg-fuchsia-300 border-fuchsia-600 border text-sm rounded-lg p-1 mr-2 mb-2">{job.jobType}</span>
                                                        <span className="text-base">📌 {job.jobLocation}</span>
                                                    </div>
                                                    <p className="mt-4 font-light text-sm text-gray-600"><span className='text-gray-900 font-semibold'>Description : </span>{job.description}</p>
                                                </div>
                                                <Link to={`/jobPage/${job._id}`} className='w-full text-xl flex justify-end'>
                                                    <MdKeyboardDoubleArrowRight />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center items-center mt-10">
                                    <p className="text-center text-gray-500">No jobs available</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {myJobListMenu && (
                    <div className="bg-white py-10 sm:py-10">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto flex mb-10">
                                <h2
                                    onClick={() => {
                                        setSelectedTab('applied');
                                    }}
                                    className={`text-2xl px-2 py-2 border-b font-bold leading-7 uppercase text-start cursor-pointer ${selectedTab === 'applied' ? 'border-fuchsia-600 text-fuchsia-600' : 'border-gray-300 text-gray-300'
                                        }`}
                                >
                                    Applied Jobs
                                </h2>
                                <h2
                                    onClick={() => {
                                        setSelectedTab('saved');
                                    }}
                                    className={`text-2xl px-2 py-2 border-b font-bold leading-7 uppercase text-start cursor-pointer ${selectedTab === 'saved' ? 'border-fuchsia-600 text-fuchsia-600' : 'border-gray-300 text-gray-300'
                                        }`}
                                >
                                    Saved Jobs
                                </h2>
                            </div>

                            {selectedTab === 'applied' && (
                                appliedJobList.length > 0 ? (
                                    <div className="flex flex-wrap -m-4">
                                        {appliedJobList.map((job) => (
                                            <div key={job._id} className="p-4 lg:w-1/2 md:w-full w-full">
                                                <div className="flex flex-col border-2 rounded-lg border-gray-200 border-opacity-50 p-8 h-full overflow-hidden">
                                                    <div className="flex-grow">
                                                        <h3 className="text-2xl font-semibold text-fuchsia-500 hover:text-fuchsia-600">{job.applicationFor}</h3>
                                                        <div className="flex items-center mt-2">
                                                            <FaIndustry className="text-gray-500" />
                                                            <span className="ml-2 text-sm">{job.company}</span>
                                                        </div>
                                                        <p className="mt-4 font-light text-sm text-gray-600">
                                                            <span className="text-gray-900 font-semibold">Description: </span>{job.about}
                                                        </p>
                                                    </div>
                                                    <Link className={`w-full text-sm font-semibold flex justify-end ${job.status === 'Accepted' ? 'text-green-600' : job.status === 'Rejected' ? 'text-red-600' : 'text-gray-500'
                                                        }`}>
                                                        Status: {job.status}
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center mt-10">
                                        <p className="text-center text-gray-500">No applied jobs available</p>
                                    </div>
                                )
                            )}

                            {selectedTab === 'saved' && (
                                savedJobList.length > 0 ? (
                                    <div className="flex flex-wrap -m-4">
                                        {savedJobList.map((user, userIndex) => (
                                            <div key={userIndex} className="p-4 lg:w-full md:w-full w-full">
                                                {user.jobId.map((job, jobIndex) => (
                                                    <div key={jobIndex} className="flex flex-col border-2 rounded-lg border-gray-200 border-opacity-50 mb-2 p-8">
                                                        <div className="flex-grow">
                                                            <h3 className="text-2xl font-semibold text-fuchsia-500 hover:text-fuchsia-600">{job.jobtitle}</h3>
                                                            <div className="flex items-center mt-2">
                                                                <FaIndustry className="text-gray-500" />
                                                                <span className="ml-2 text-lg">{job.company}</span>
                                                            </div>
                                                            <div className="flex flex-wrap items-center mt-4">
                                                                <span className="bg-fuchsia-300 border-fuchsia-600 border text-sm rounded-lg p-1 mr-2 mb-2">{job.jobType}</span>
                                                                <span className="text-base">📌 {job.jobLocation}</span>
                                                            </div>
                                                            <p className="mt-4 font-light text-sm text-gray-600">
                                                                <span className="text-gray-900 font-semibold">Description: </span>{job.description}
                                                            </p>
                                                        </div>
                                                        <Link to={`/SingleJobViewPage/${job._id}`} className="w-full text-xl flex justify-end">
                                                            <MdKeyboardDoubleArrowRight />
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center mt-10">
                                        <p className="text-center text-gray-500">No saved jobs available</p>
                                    </div>
                                )
                            )}
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
                            <div className='w-full px-10 lg:w-1/2 lg:px-0'>
                                <div className="border-b border-gray-900/10 pb-12" >
                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="sm:col-span-full">
                                            <label htmlFor="resume" className="block text-lg font-bold leading-6 text-gray-900">
                                                Resume
                                            </label>
                                            <p className="mt-1 text-xs font-bold text-gray-500">Be sure to include an Updated resume</p>
                                            <div className="mt-2">
                                                <label
                                                    htmlFor="resume-upload"
                                                    className="inline-block cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-fuchsia-600 hover:bg-gray-100"
                                                >
                                                    Upload resume
                                                </label>
                                                <input
                                                    type="file"
                                                    id="resume-upload"
                                                    name="resume"
                                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                                    className="hidden"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">DOC, DOCX, PDF (2 MB)</p>
                                            </div>
                                        </div>

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
                                                    value={userDetails.name}
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
                                                    value={userDetails.email}
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
                                                    value={userDetails.phone}
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
                                                    value={userDetails.dob}
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
                                                    <input id='genderMale' name='gender' value='male' type='radio' checked={userDetails.gender === 'male'} onChange={handleInputChange} />Male
                                                </label>
                                                <label htmlFor="genderFemale" className="block text-sm font-medium leading-6 text-gray-900">
                                                    <input id='genderFemale' name='gender' value='female' type='radio' checked={userDetails.gender === 'female'} onChange={handleInputChange} />Female
                                                </label>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                                                Role
                                            </label>
                                            <div className="mt-2 flex items-center gap-10">
                                                <label htmlFor="roleJobseeker" className="block text-sm font-medium leading-6 text-gray-900">
                                                    <input id='roleJobseeker' name='role' value='jobSeeker' type='radio' checked={userDetails.role === 'jobSeeker'} onChange={handleInputChange} />Job-Seeker
                                                </label>
                                                <label htmlFor="roleEmployer" className="block text-sm font-medium leading-6 text-gray-900">
                                                    <input id='roleEmployer' name='role' value='employer' type='radio' checked={userDetails.role === 'employer'} onChange={handleInputChange} />Employer
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
                                                    value={userDetails.city}
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
                                                    value={userDetails.state}
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
                                                    value={userDetails.country}
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
                                                    value={userDetails.about}
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
                                                    value={userDetails.portfolio}
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
                                                    value={userDetails.gitHub}
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
                                                    value={userDetails.linkedin}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className='col-span-full border-b-2 text-center font-bold text-2xl text-fuchsia-600 py-2'>
                                            <h4>Preferance</h4>
                                        </div>


                                        <div className="sm:col-span-3 sm:col-start-1">
                                            <label htmlFor="preferedJobLocation" className="block text-sm font-medium leading-6 text-gray-900">
                                                Prefered Job Location
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    name="preferedJobLocation"
                                                    onChange={handleInputChange}
                                                    value={userDetails.preferedJobLocation}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6"
                                                >
                                                    <option value="" disabled selected>Select location</option>
                                                    <option value={'Anywhere in India'}>Anywhere in India</option>
                                                    <option value={'Andhra Pradesh'}>Andhra Pradesh</option>
                                                    <option value={'Arunachal Pradesh'}>Arunachal Pradesh</option>
                                                    <option value={'Assam'}>Assam</option>
                                                    <option value={'Bihar'}>Bihar</option>
                                                    <option value={'Chhattisgarh'}>Chhattisgarh</option>
                                                    <option value={'Goa'}>Goa</option>
                                                    <option value={'Gujarat'}>Gujarat</option>
                                                    <option value={'Haryana'}>Haryana</option>
                                                    <option value={'Himachal Pradesh'}>Himachal Pradesh</option>
                                                    <option value={'Jharkhand'}>Jharkhand</option>
                                                    <option value={'Karnataka'}>Karnataka</option>
                                                    <option value={'Kerala'}>Kerala</option>
                                                    <option value={'Madhya Pradesh'}>Madhya Pradesh</option>
                                                    <option value={'Maharashtra'}>Maharashtra</option>
                                                    <option value={'Manipur'}>Manipur</option>
                                                    <option value={'Meghalaya'}>Meghalaya</option>
                                                    <option value={'Mizoram'}>Mizoram</option>
                                                    <option value={'Nagaland'}>Nagaland</option>
                                                    <option value={'Odisha'}>Odisha</option>
                                                    <option value={'Punjab'}>Punjab</option>
                                                    <option value={'Rajasthan'}>Rajasthan</option>
                                                    <option value={'Sikkim'}>Sikkim</option>
                                                    <option value={'Tamil Nadu'}>Tamil Nadu</option>
                                                    <option value={'Telangana'}>Telangana</option>
                                                    <option value={'Tripura'}>Tripura</option>
                                                    <option value={'Uttar Pradesh'}>Uttar Pradesh</option>
                                                    <option value={'Uttarakhand'}>Uttarakhand</option>
                                                    <option value={'West Bengal'}>West Bengal</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="preferedJobType" className="block text-sm font-medium leading-6 text-gray-900">
                                                Prefered Job Type
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    name="preferedJobType"
                                                    onChange={handleInputChange}
                                                    value={userDetails.preferedJobType}
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
                                            <label htmlFor="experienceLevel" className="block text-sm font-medium leading-6 text-gray-900">
                                                Experience Level
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    name="experienceLevel"
                                                    onChange={handleInputChange}
                                                    value={userDetails.experienceLevel}
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6"
                                                >
                                                    <option value="" disabled selected>Select experience</option>
                                                    <option value={'0-1 years'}>0-1 year</option>
                                                    <option value={'1-3 years'}>1-3 years</option>
                                                    <option value={'3-5 years'}>3-5 years</option>
                                                    <option value={'5+ years'}>5+ years</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="expectedSalary" className="block text-sm font-medium leading-6 text-gray-900">
                                                Expected Salary (In Lakhs Per Annum)
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    name="expectedSalary"
                                                    onChange={handleInputChange}
                                                    value={userDetails.expectedSalary}
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
                            <button type='submit' className="mt-6 bg-fuchsia-600 text-white py-2 px-4 rounded">Update</button>
                        </div>
                    </form>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}
