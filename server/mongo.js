const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
mongoose.connect("mongodb+srv://mcvicky2601:ywU4KYDOZDzpnPZ6@jobland.wow0mev.mongodb.net/?retryWrites=true&w=majority&appName=JobLand")
    .then(() => {
        console.log("Mongo Connected...");
    }).catch(() => {
        console.log("Mongo Connection Failed...");
    })


// JOB SCHEMA
const jobSchema = new mongoose.Schema({
    industry: {
        type: String,
    },
    mode: {
        type: String,
    },
    company: {
        type: String,
    },
    companyLocation: {
        type: String,
    },
    aboutCompany: {
        type: String,
    },
    services: {
        type: String,
    },
    jobtitle: {
        type: String,
    },
    description: {
        type: String,
    },
    jobLocation: {
        type: String,
    },
    qualification: {
        type: String,
    },
    jobType: {
        type: String,
    },
    numberOfPeople: {
        type: String,
    },
    experienceLevel: {
        type: String,
    },
    salary: {
        type: String,
    },
    email: {
        type: String,
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

const jobCollection = mongoose.model("jobCollection", jobSchema);

// APPLICATION SCHEMA
const applicationSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    applicationFor: {
        type: String,
    },
    company: {
        type: String,
    },
    applicationJobId: {
        type: ObjectId
    },
    email: {
        type: String,
    },
    salaryExpectation: {
        type: String,
    },
    about: {
        type: String,
    },
    attachment: {
        type: String,
    },
    resumePath: {
        type: String
    },
    resumeFilename: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
}, { timestamps: true });


// SAVEDJOB SCEMA
const savedJobSchema = new mongoose.Schema({
    jobId: [{
        type: ObjectId,
        ref: 'jobCollection'
    }],
    email: {
        type: String,
    }
}, { timestamps: true });


// USER AND ADMIN SCHEMA
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    dob: {
        type: Date
    },
    gender: {
        type: String
    },
    role: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    about: {
        type: String
    },
    portfolio: {
        type: String
    },
    gitHub: {
        type: String
    },
    linkedin: {
        type: String
    },
    preferedJobLocation: {
        type: String
    },
    preferedJobType: {
        type: String
    },
    experienceLevel: {
        type: String
    },
    expectedSalary: {
        type: String
    },
    attachment: {
        type: String,
    },
    resumePath: {
        type: String
    },
    resumeFilename: {
        type: String
    },
}, { timestamps: true });


userSchema.methods.calculateProfileCompletion = function () {
    const requiredFields = [
        'name', 'email', 'phone', 'dob', 'gender', 'city',
        'state', 'country', 'about', 'portfolio', 'gitHub',
        'linkedin', 'preferedJobLocation', 'preferedJobType',
        'experienceLevel', 'expectedSalary'
    ];

    let filledFields = 0;
    requiredFields.forEach(field => {
        if (this[field]) {
            filledFields++;
        }
    });

    return (filledFields / requiredFields.length) * 100;
};



// SETTING SCHEMAS TO MONGODB USING MONGOOSE.MODEL()
const userCollection = mongoose.model("userCollection", userSchema);
const savedJobCollection = mongoose.model("savedJobCollection", savedJobSchema);
const applicationCollection = mongoose.model("applicationCollection", applicationSchema);



// SAVING ALL THE SCHEMA COLLECTION INTO SINGLE COLLECTION
const collection = {
    userCollection,
    jobCollection,
    savedJobCollection,
    applicationCollection
};


// EXPORTING THE COLLECTION TO SERVER TO USE THE COLLECTION DB
module.exports = collection