const mongoose = require('mongoose');
const validator = require('validator');

const employeeSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  last_name: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required']
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [1000, 'Salary must be at least 1000']
  },
  date_of_joining: {
    type: Date,
    required: [true, 'Date of joining is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  employee_photo: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});


employeeSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
