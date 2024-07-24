import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";

import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Applicationform from './Components/Applicationform';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import AdminAccount from './Components/AdminAccount';
import UserAccount from './Components/UserAccount';
import JobLists from './Components/JobLists';
import JobPage from './Components/JobPage';
import Applicants from './Components/Applicants';
import SingleJobViewPage from './Components/SingleJobViewPage';
import Recruiter from './Components/Recruiter';
import Candidate from './Components/Candidate';


function App() {
  const [cookieVal, setCookieVal] = useState(Cookies.get("email"));
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCookie = Cookies.get("email");
      if (updatedCookie !== cookieVal) {
        setCookieVal(updatedCookie);
      }
    }, 1000);
    return () => { clearInterval(interval); }
  }, [cookieVal]);

  useEffect(() => {
  }, [location.pathname]);

  const hideNavbarPaths = ['/login', '/signup', '/forgotPassword', '/resetpassword', '/admin'];

  return (
    <div className='App'>
      {/* Render Navbar conditionally */}
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        {cookieVal === undefined && <Route path='/login' element={<Login />} />}
        {cookieVal === "access.ecourse78@gmail.com" && <Route path='/login' element={<AdminAccount />} />}
        {cookieVal !== undefined && cookieVal !== "access.ecourse78@gmail.com" && <Route path='/login' element={<UserAccount />} />}
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route path='/jobList' element={<JobLists />} />
        <Route path='/jobPage/:id' element={<JobPage />} />
        <Route path='/singleJobViewPage/:id' element={<SingleJobViewPage />} />
        <Route path='/applicants/:id' element={<Applicants />} />
        <Route path='/application' element={<Applicationform />} />
        <Route path='/recruiter/:id' element={<Recruiter />} />
        <Route path='/candidate/:id' element={<Candidate />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default WrappedApp;
