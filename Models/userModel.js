const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    firstName: {
        type: String,
        required: false,  // Optional (could be omitted if desired)
    },
    lastName: {
        type: String,
        required: true,
    },
    DoB: {
        type: Date,
        default: Date.now,  // Default is current date
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{10,15}/.test(v);  // Validate phone numbers (example)
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    country: {
        type: String
    },
    sex: {
        type: String,
        enum: ['male', 'female', 'other'],  // Add an enum for gender if necessary
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure email is unique
        lowercase: true,  // Automatically convert emails to lowercase
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);  // Validate email format
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    googleId: {
        type: String,
    },
    projects: [{
        type: schema.Types.ObjectId,
        ref: 'Project'  // Reference the Project model
    }],
    otp: {
        type: Number,
    },
    otp_date: {
        type: Date,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    suspended: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

const Users = mongoose.model('User',userSchema);

module.exports= Users;
