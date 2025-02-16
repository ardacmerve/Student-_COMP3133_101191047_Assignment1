const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const resolvers = {
  Query: {
    login: async (_, { usernameOrEmail, password }) => {
      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
      }).select('+password');

      if (!user || !(await user.correctPassword(password, user.password))) {
        throw new Error('Incorrect username/email or password');
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });

      return {
        token,
        user
      };
    },

    getAllEmployees: async () => {
      return await Employee.find();
    },

    getEmployeeById: async (_, { id }) => {
      return await Employee.findById(id);
    },

    searchEmployees: async (_, { designation, department }) => {
      const query = {};
      if (designation) query.designation = designation;
      if (department) query.department = department;
      return await Employee.find(query);
    },
    
    getEmployeeById: async (_, { id }) => {
      const employee = await Employee.findById(id);
      if (!employee) {
        throw new Error('Employee not found');
      }
      return employee;
    },

    getAllEmployees: async () => {
      return await Employee.find().sort({ created_at: -1 });
    }

  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const newUser = await User.create({
        username,
        email,
        password
      });
      return newUser;
    },

    addEmployee: async (_, args) => {
      const newEmployee = await Employee.create(args);
      return newEmployee;
    },

    updateEmployee: async (_, { id, ...updateData }) => {
      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      return updatedEmployee;
    },

    deleteEmployee: async (_, { id }) => {
      const employee = await Employee.findByIdAndDelete(id);
      if (!employee) {
        throw new Error('Employee not found');
      }
      return true;
    },

    updateEmployee: async (_, { id, ...updateData }) => {
      const employee = await Employee.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!employee) {
        throw new Error('Employee not found');
      }
      return employee;
    }

  }
};

module.exports = resolvers;
