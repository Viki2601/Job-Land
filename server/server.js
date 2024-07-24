const cors = require("cors");
const bcrypt = require("bcryptjs");
const express = require("express");
const nodemailer = require("nodemailer");
require('dotenv').config();
const { userCollection, jobCollection, applicationCollection, savedJobCollection } = require("./mongo");
const PORT = process.env.PORT || 8000
const multer = require('multer');
const path = require('path'); const { error } = require("console");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname;
        const extension = path.extname(originalName);
        const baseName = path.basename(originalName, extension);
        cb(null, baseName + extension);
    }
});
const upload = multer({ storage: storage })


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get("/", cors(), (req, res) => { })


async function hashPass(password) {
    const res = await bcrypt.hash(password, 10);
    return res;
}
async function compare(userPass, hashPass) {
    const res = await bcrypt.compare(userPass, hashPass);
    return res;
}

// SignUp endPoint
app.post("/signup", async (req, res) => {
    const form = req.body.form;
    const data = {
        name: form.name,
        email: form.email,
        password: await hashPass(form.password),
    };
    try {
        const check = await userCollection.findOne({ email: form.email })
        if (check) {
            res.json("exists");
        } else {
            res.json("notexists")
            await userCollection.insertMany([data]);
        }
    } catch (e) {
        res.json("Failed...")
    };
});


// Login endPoint
app.post("/login", async (req, res) => {
    const form = req.body.form;
    try {
        const check = await userCollection.findOne({ email: form.email });
        if (check) {
            const passcheck = await compare(form.password, check.password);
            passcheck ? res.json("loginpass") : res.json("loginfail");
        } else {
            res.json("nouser");
        };
    } catch (e) {
        res.json("fail");
    };
});


// OTP verfication for forgot password endPoint
app.post("/sendemail", async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;

        const check = await userCollection.findOne({ email: email });

        if (check) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: 'access.ecourse78@gmail.com',
                    pass: 'sqri zuuz cdbv qewc'
                }
            });
            const mailOption = {
                from: "Job-Land",
                to: email,
                subject: "Password reset",
                text: `Here's your OTP to reset your Password ${otp}`,
            };
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    res.json('fail');
                } else {
                    res.json('pass');
                }
            });
        } else {
            res.json("notexists");
        }
    } catch (e) {
        res.json('fail');
    };
});


// Reset password endPoint
app.post("/resetPassword", async (req, res) => {
    const cookieVal = req.body.cookieVal;
    const password = req.body.password;
    try {
        const newPass = await hashPass(password);
        await userCollection.updateOne(
            { email: cookieVal },
            { $set: { password: newPass } }
        );
        res.json("pass");
    } catch (e) {
        res.json("fail");
    };
});


// Fetch the user credential by using email
app.post("/userAccount", async (req, res) => {
    try {
        const email = req.body.cookieVal;
        const check = await userCollection.findOne({ email: email });
        const profileCompletion = check.calculateProfileCompletion();
        res.json({ check, profileCompletion });
    } catch (e) {
        console.log(e)
    };
});

// Updating the user credential by using email
app.post('/updateProfile', upload.single('resume'), async (req, res) => {
    try {
        const {
            name, email, phone, dob, gender, role, city, state, country, about,
            portfolio, gitHub, linkedin, preferedJobLocation, preferedJobType,
            experienceLevel, expectedSalary
        } = req.body;

        const user = await userCollection.findOneAndUpdate(
            { email: email },
            {
                name, phone, dob, gender, role, city, state, country, about,
                portfolio, gitHub, linkedin, preferedJobLocation, preferedJobType,
                experienceLevel, expectedSalary
            },
            { new: true }
        );

        if (req.file) {
            user.resumePath = req.file.path;
            user.resumeFilename = req.file.filename;
            await user.save();
        }

        const profileCompletion = user.calculateProfileCompletion();
        res.json({ user, profileCompletion });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// Posting a job as a recruiter
app.post("/postJobs", async (req, res) => {
    const newJob = req.body.formData;
    const email = req.body.cookieVal;
    try {
        const data = {
            industry: newJob.industry,
            mode: newJob.mode,
            company: newJob.company,
            jobtitle: newJob.jobtitle,
            companyLocation: newJob.companyLocation,
            services: newJob.services,
            aboutCompany: newJob.aboutCompany,
            description: newJob.description,
            jobLocation: newJob.jobLocation,
            qualification: newJob.qualification,
            jobType: newJob.jobType,
            numberOfPeople: newJob.numberOfPeople,
            experienceLevel: newJob.experienceLevel,
            salary: newJob.salary,
            email: email,
            createdAt: new Date()
        };

        // Insert the job into the jobCollection
        await jobCollection.insertMany(data);

        res.json("pass");
    } catch (e) {
        res.json("fail");
    };
});

// Fetching all the jobs 
app.get("/getAllJobs", async (req, res) => {
    try {
        const data = await jobCollection.find({});
        res.json(data);
    } catch (e) {
        res.json("fail");
    };
});


// Fetch the jobs  by using mail id to display the jobs for the recruiter who are posted the job
app.post("/jobsByMail", async (req, res) => {
    try {
        const email = req.body.cookieVal;
        const data = await jobCollection.find({ email: email });
        res.json(data);
    } catch (e) {
        console.log(e)
    };
});

// Saving the to the savedCollection 
app.post("/savedJob", async (req, res) => {
    const { email, jobId } = req.body;
    try {
        let savedJob = await savedJobCollection.findOne({ email });
        if (!savedJob) {
            savedJob = new savedJobCollection({ email, jobId: [jobId] });
        } else if (!savedJob.jobId.includes(jobId)) {
            savedJob.jobId.push(jobId);
        }
        await savedJob.save();
        res.json("pass");
    } catch (e) {
        console.log(e);
        res.json("fail");
    };
});

// Application details
app.post("/application", upload.single("resume"), async (req, res) => {
    try {
        const { fullName, applicationFor, company, applicationJobId, email, salaryExpectation, about } = req.body;
        const resume = req.file;
        if (!resume) {
            res.json("fail.");
        }
        const newApplication = new applicationCollection({
            fullName,
            applicationFor,
            company,
            applicationJobId,
            email,
            salaryExpectation,
            about,
            resumePath: resume.path,
            resumeFilename: resume.filename
        });
        // console.log(newApplication)
        await newApplication.save();
        res.json("pass");
    } catch (error) {
        // console.error("Error processing application:", error);
        res.json("fail");
    };
});

// Fetching the jobs by using job id for recruiters
app.post("/jobsById/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await jobCollection.findById(id)
        res.json(data);
    } catch (e) {
        console.log(e)
    };
})

// Deleting the jobs by using job id for recruiters
app.post("/deleteJob/:id", async (req, res) => {
    const id = req.params.id;
    try {
        // console.log(id)
        await jobCollection.findByIdAndDelete(id);
        res.json("pass")
    } catch (e) {
        console.log(e)
        res.json("fail");
    };
});

// Updating the jobs by using job id for recruiters
app.post("/updateJob/:id", async (req, res) => {
    const id = req.params.id;
    const {
        company,
        jobtitle,
        companyLocation,
        services,
        aboutCompany,
        description,
        jobLocation,
        qualification,
        jobType,
        numberOfPeople,
        experienceLevel,
        salary,
    } = req.body;
    try {
        await jobCollection.findByIdAndUpdate(id, {
            company,
            jobtitle,
            companyLocation,
            services,
            aboutCompany,
            description,
            jobLocation,
            qualification,
            jobType,
            numberOfPeople,
            experienceLevel,
            salary,
        }, { new: true, runValidators: true });
        res.json('pass');
    } catch (e) {
        res.json('fail');
    };
});

// Fetching the applicants who are applied for the particular job roles
app.post("/applicantsByJobId/:id", async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id);

        const data = await applicationCollection.find({ applicationJobId: id });
        // const jobData = await jobCollection.find({ _id: id })
        // console.log(data);
        res.json(data);
        // res.json(jobData);
    } catch (e) {
        console.log(e);
    };
});

// Status update and sending selection mail to the applicant
app.post("/sendSelectionMail", async (req, res) => {
    try {
        const { _id, email, fullName, jobTitle, company } = req.body;

        const check = await applicationCollection.findOne({ _id });
        if (check) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.AUTH_EMAIL,
                    pass: process.env.AUTH_EMAIL_PASS
                }
            });
            const mailOption = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: `Congratulations! You have been shortlisted for ${jobTitle}`,
                text: `Dear ${fullName},\n\nCongratulations! You have been shortlisted for the ${jobTitle} position at ${company}.\n\nYour interview will be scheduled as soon as possible and shared to your mail. \n\nBest regards,\n${company}`,
            };
            transporter.sendMail(mailOption, async (error, info) => {
                if (error) {
                    console.log(error)
                    res.json('fail');
                } else {
                    await applicationCollection.findOneAndUpdate({ _id }, { status: 'Accepted' })
                    res.json('pass');
                }
            });
        } else {
            res.json('fail');
        }
    } catch (e) {
        console.log(e)
        res.json('fail');
    }
});

// Status update and sending rejection mail to the applicant
app.post("/sendRejectionMail", async (req, res) => {
    try {
        const { _id, email, fullName, jobTitle, company } = req.body;

        const check = await applicationCollection.findOne({ _id });
        if (check) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.AUTH_EMAIL,
                    pass: process.env.AUTH_EMAIL_PASS
                }
            });
            const mailOption = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: `${company} : We have decided on your application ${jobTitle}`,
                text: `Dear ${fullName},\n\nThank you once again for applying for the position of ${jobTitle}.
                \nWe have carefully reviewed your profile but unfortunately, the vacancy is no longer available. As such, we are unable to proceed with your application. Please note that this by no means is a reflection of your skills or experience.
                \nWe sincerely hope that you will remain interested in ${company}, and consider applying for other suitable positions with us in future.
                \n\nBest regards,\n${company}`,
            };
            transporter.sendMail(mailOption, async (error, info) => {
                if (error) {
                    console.log(error)
                    res.json('fail');
                } else {
                    await applicationCollection.findOneAndUpdate({ _id }, { status: 'Rejected' })
                    res.json('pass');
                }
            });
        } else {
            res.json('fail');
        }
    } catch (e) {
        console.log(e)
        res.json('fail');
    }
});

// Fetching the applied jobs details and status for applicant view
app.post("/appliedJobsByMail", async (req, res) => {
    try {
        const email = req.body.cookieVal;
        const data = await applicationCollection.find({ email: email });
        res.json(data);
    } catch (e) {
        console.log(e)
    };
});

// Fetching the saved jobs details for applicant view
app.post("/savedJobsByMail", async (req, res) => {
    try {
        const email = req.body.cookieVal;
        const data = await savedJobCollection.find({ email }).populate('jobId');
        // console.log(data);
        res.json(data);
    } catch (e) {
        console.log(e)
    };
});





// // // // // // // // // // // // // // // // // // // // // // // 
//                                                                //
//                      ADMIN DETAILS                             //
//          ALL DATA, CANDIDATE DETAILS, RECRUITER DETAILS,       //
//               COMPANY DETAILS, ADMIN INFO, TO-DO               //
//                                                                //
// // // // // // // // // // // // // // // // // // // // // // // 

app.get('/applicant', async (req, res) => {
    const applicant = req.query.role;
    // console.log(applicant)
    try {
        const count = await userCollection.find({ role: applicant });
        res.json(count);
    } catch (e) {
        console.log(e);
    };
});

app.get('/recruiter', async (req, res) => {
    const applicant = req.query.role;
    // console.log(applicant)
    try {
        const count = await userCollection.find({ role: applicant });
        res.json(count);
    } catch (e) {
        console.log(e);
    };
});

app.get('/application', async (req, res) => {
    try {
        const count = await applicationCollection.countDocuments();
        res.json(count);
    } catch (e) {
        console.log(e);
    };
});

app.get('/jobs', async (req, res) => {
    try {
        const count = await jobCollection.countDocuments();
        res.json(count);
    } catch (e) {
        console.log(e);
    };
});

app.get('/graphData', async (req, res) => {
    try {
        const application = await applicationCollection.find();
        const graphData = application.reduce((acc, app) => {
            const month = new Date(app.createdAt).toLocaleString('default', { month: 'short' });
            if (!acc[month]) acc[month] = 0;
            acc[month]++;
            return acc;
        }, {});
        const graphDataArray = Object.entries(graphData).map(([month, count]) => ({ month, count }));
        res.json(graphDataArray);
    } catch (e) {
        console.log(e);
    };
});

app.get('/jobGraphData', async (req, res) => {
    try {
        const jobs = await jobCollection.find();
        const graphData = jobs.reduce((acc, app) => {
            const month = new Date(app.createdAt).toLocaleString('default', { month: 'short' });
            if (!acc[month]) acc[month] = 0;
            acc[month]++;
            return acc;
        }, {});
        const graphDataArray = Object.entries(graphData).map(([month, count]) => ({ month, count }));
        res.json(graphDataArray);
    } catch (e) {
        console.log(e);
    };
});

app.get('/recentJobs', async (req, res) => {
    try {
        const jobs = await jobCollection.find().sort({ postedDate: -1 }).limit(10);
        res.json(jobs);
    } catch (err) {
        res.json("fail");
    }
});

app.get('/candidate/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await userCollection.findById(id);
        res.json(data);
    } catch (e) {
        console.log(e);
        res.json("fail");
    };
});

app.get('/recruiter/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await userCollection.findById(id);
        res.json(data);
    } catch (e) {
        console.log(e);
        res.json("fail");
    };
});


app.listen(PORT, () => {
    console.log("Port Connected...");
})