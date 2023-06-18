const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const travelerSchema = mongoose.Schema(
  {
    // role: {
    //   type: String,
    //   enum: roles,
    //   default: 'traveler',
    // },
    isStudent: {
      type: Boolean,
      default: false,
    },
    NationalId: {
      type: String,
    },

    StudentUniversityId: {
      type: String,
    },
    CollegeEnrollmentStatement: {
      type: String,
    },
    EmployeeCompanyId: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    Trip: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
      },
    ],
    NationalIdCard: {
      type: String,
    },
    isAdminVerificationPending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Traveler = mongoose.model('Traveler', travelerSchema);

module.exports = Traveler;
