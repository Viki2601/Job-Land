import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendar, FaIndustry, FaRegBookmark } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { FaLocationDot } from 'react-icons/fa6';
import { FcClearFilters } from "react-icons/fc";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';


export default function JobLists() {
  const [allJobs, setAllJobs] = useState([]);
  const navigate = useNavigate();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailedJobMenu, setDetailedJobMenu] = useState(false);
  const url = "https://job-land-backend.onrender.com";



  const [filters, setFilters] = useState({
    // salary: '',
    industry: '',
    jobType: '',
    experienceLevel: '',
    location: ''
  });

  const getAllJobs = async () => {
    try {
      const res = await axios.get(`${url}/getAllJobs`);
      if (res.data === "fail") {
        toast.error("Failed to fetch Jobs");
      } else {
        setAllJobs(res.data);
        setFilteredJobs(res.data);
      }
    } catch (e) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setDetailedJobMenu(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    filterJobs({ ...filters, [name]: value });
  };

  const filterJobs = (filters) => {
    let jobs = [...allJobs];

    // if (filters.salary) {
    //   jobs = jobs.filter(job => job.salary === filters.salary);
    // }
    if (filters.industry) {
      jobs = jobs.filter(job => job.industry === filters.industry);
    }
    if (filters.jobType) {
      jobs = jobs.filter(job => job.jobType === filters.jobType);
    }
    if (filters.experienceLevel) {
      jobs = jobs.filter(job => job.experienceLevel === filters.experienceLevel);
    }
    if (filters.location) {
      jobs = jobs.filter(job => job.jobLocation.includes(filters.location));
    }

    setFilteredJobs(jobs);
  };


  const clearFilters = () => {
    const resetFilters = {
      // salary: '',
      industry: '',
      jobType: '',
      experienceLevel: '',
      location: ''
    };
    setFilters(resetFilters);
    setFilteredJobs(allJobs);
  };


  const saveJob = async (e) => {
    // e.preventDefault();
    try {
      const jobId = selectedJob._id;
      const email = Cookies.get("email");
      const res = await axios.post(`${url}/savedJob`, { jobId, email })
      if (res.data === "pass") {
        toast.success("Saved Successfully");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  const handleApply = () => {
    navigate('/application', { state: { job: selectedJob } });
  };

  return (
    <div>
      <div className="m-4 p-4 rounded-xl border">
        <div className="mb-4 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <select name="industry" value={filters.industry} onChange={handleFilterChange} className="p-2 text-sm outline-none border rounded-lg">
            <option value="" disabled selected>Select Industry</option>
            <option>Areospace & Defense</option>
            <option>Engineering</option>
            <option>Human Resources & Staffing</option>
            <option>Information Technology</option>
            <option>Manufacturing</option>
            <option>Telecommunications</option>
            <option>Tourism</option>
            <option>Transportation</option>
          </select>
          <select name="jobType" value={filters.jobType} onChange={handleFilterChange} className="p-2 text-sm outline-none border rounded-lg">
            <option value="" disabled selected>Select Job Type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Permanent">Permanent</option>
            <option value="Fresher">Fresher</option>
          </select>
          <select name="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange} className="p-2 text-sm outline-none border rounded-lg">
            <option value="" disabled selected>Select Experience</option>
            <option value="0-1 years">0-1 Years</option>
            <option value="1-3 years">1-3 Years</option>
            <option value="3-5 years">3-5 Years</option>
            <option value="5+ years">5+ Years</option>
          </select>
          <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Location" className="p-2 border border-fuchsia-500 outline-fuchsia-500 rounded-lg" />
          <button onClick={clearFilters} className="text-xl"><FcClearFilters /></button>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 shadow-md rounded-lg lg:border-gray-300">
            <ul className="h-full">
              {filteredJobs.map((i) => (
                <li key={i._id}
                  className="flex flex-col lg:flex-row justify-between cursor-pointer py-5 px-4 lg:px-8 border-b"
                  onClick={() => handleJobClick(i)}>
                  <div>
                    <div className="font-semibold text-lg text-fuchsia-500 hover:text-fuchsia-600">{i.jobtitle}</div>
                    <div className="flex items-center">
                      <FaIndustry />
                      <h4 className="px-2">{i.industry}</h4>
                    </div>
                    <div className="flex items-center">
                      <FaCalendar />
                      <h4 className="px-2">{i.experienceLevel}</h4>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-end mt-2 lg:mt-0">
                    <div className="bg-fuchsia-300 border-fuchsia-600 border text-sm rounded-lg p-1 mb-2">{i.jobType}</div>
                    <div className="flex items-center">
                      <FaLocationDot />
                      <h4 className="px-2">{i.jobLocation}</h4>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {detailedJobMenu && selectedJob && (
            <div className="w-full lg:w-1/2 p-4 rounded-lg shadow-md">
              <div className='flex justify-between items-center'>
                <div>
                  <h2 className="text-2xl font-bold text-fuchsia-600">{selectedJob.jobtitle}</h2>
                  <h3>{selectedJob.company}</h3>
                </div>
                <div className='flex justify-between items-center'>
                  <button onClick={handleApply} className='bg-fuchsia-600 rounded-lg py-2 px-5 mr-3 text-white text-sm'>Apply</button>
                  <FaRegBookmark onClick={saveJob} className='cursor-pointer' />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Industry:</h4>
                <p className='text-sm'>{selectedJob.industry}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Job Type:</h4>
                <p className='text-sm'>{selectedJob.jobType}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Location:</h4>
                <p className='text-sm'>{selectedJob.jobLocation} / {selectedJob.mode}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Description:</h4>
                <p className='text-sm'>{selectedJob.description}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Openings:</h4>
                <p className='text-sm'>{selectedJob.numberOfPeople}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Experience:</h4>
                <p className='text-sm'>{selectedJob.experienceLevel}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Salary:</h4>
                <p className='text-sm'>{selectedJob.salary} {" "} Lakhs per Annum</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Qualification:</h4>
                <p className='text-sm'>{selectedJob.qualification}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
