const User = require('../models/user.model')
const fs = require('fs');

const Student = async (id) => {
  // const id = req.user._id;
  const userExist = await User.findById(id)
  if (userExist) {
    if (userExist.isStudent) {
      return {
        message: 'Traveler is already a student',
      }
    } else {
      const updateTraveller = await User.findByIdAndUpdate(id, {
        isStudent: true,
      }, {
        new: true,
      })

      return {
        message: 'Traveler is already a student',
        isStudent: updateTraveller.isStudent
      }
    }
  } else {
    return {
      message: 'Traveler is already a student',
    }
  }
};

const Employee = async (id) => {
  // const id = req.user._id;
  const userExist = await User.findById(id)
  if (userExist) {
    if (!userExist.isStudent) {
      return {
        message: 'Traveler is already a employee',
      }
    } else {
      const updateTraveller = await User.findByIdAndUpdate(id, {
        isStudent: false,
      }, {
        new: true,
      })
      return {
        message: 'Traveler is a employee',
        isStudent: updateTraveller.isStudent
      }
    }
  } else {
    return {
      message: 'User not found',
    }
  }
};

const createTraveler = async (id, req) => {
  try {
    // const id = req.user._id;
    const foundedUser = await User.findById(id);
    if (foundedUser.isTraveler) {
      return {
        message: 'User is already a traveler',
      }
    } else {
      const {
        NationalId,
        birthdate,
        city,
        government
      } = req.body;

      if (req.fileUploadError) {
        return {
          message: 'invalid file, accepted files->(png,jpg,jpeg)',
        }
      }
      // console.log(req.files.CollegeEnrollmentStatement);
      // console.log(req.files.CollegeEnrollmentStatement[0].filename);
      if (foundedUser.isStudent) {
        let StudentUniversityId_URL = `${req.protocol}://${req.headers.host}/${req.destination}/${req.files.StudentUniversityId[0].filename}`;
        let CollegeEnrollmentStatement_URL = `${req.protocol}://${req.headers.host}/${req.destination2}/${req.files.CollegeEnrollmentStatement[0].filename}`;
        // console.log(StudentUniversityId_URL);
        const updatedUser = await User.findByIdAndUpdate(
          id, {
            role: 'traveler',
            isTraveler: true,
            NationalId,
            birthdate,
            city,
            government,
            StudentUniversityId: StudentUniversityId_URL,
            CollegeEnrollmentStatement: CollegeEnrollmentStatement_URL,
            EmployeeCompanyId: null,
          }, {
            new: true,
          }
        );
        return {
          message: 'Traveler created successfully',
          updatedUser,
        }
      } else {
        let EmployeeCompanyId_URL = `${req.protocol}://${req.headers.host}/${req.destination3}/${req.files.EmployeeCompanyId[0].filename}`;
        // console.log(EmployeeCompanyId_URL);
        const updatedUser = await User.findByIdAndUpdate(
          id, {
            isTraveler: true,
            role: 'traveler',
            NationalId,
            birthdate,
            city,
            government,
            EmployeeCompanyId: EmployeeCompanyId_URL,
            StudentUniversityId: null,
            CollegeEnrollmentStatement: null,
          }, {
            new: true,
          }
        );
        return {
          message: 'Traveler created successfully',
          updatedUser,
        }
      }
    }
  } catch (error) {
    return {
      message: 'Something went wrong',
      err: error.message,
    }
  }
};

const updateTraveler = async (id, req) => {
  try {
    // const id = req.user._id;
    const {
      NationalId,
      birthdate,
      phone,
      city,
      government
    } = req.body;

    const userExist = await User.findById(id);
    if (userExist.isTraveler) {
      if (userExist.isStudent) {
        // console.log(userExist.StudentUniversityId.split('/').pop());
        const oldStudentUniversityId = userExist.StudentUniversityId.split('/').pop();
        const oldCollegeEnrollmentStatement = userExist.CollegeEnrollmentStatement.split('/').pop();
        fs.unlink(`./src/uploads/Traveler/StudentUniversityId/${oldStudentUniversityId}`, (err) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.log(err);
          }
        });
        fs.unlink(`./src/uploads/Traveler/CollegeEnrollmentStatement/${oldCollegeEnrollmentStatement}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
        console.log(req.files);
        let newStudentUniversityIdURL = `${req.protocol}://${req.headers.host}/${req.destination}/${req.files.StudentUniversityId[0].filename}`
        let newCollegeEnrollmentStatementURL = `${req.protocol}://${req.headers.host}/${req.destination2}/${req.files.CollegeEnrollmentStatement[0].filename}`
        const updateTraveler = await User.findByIdAndUpdate(
          id, {
            NationalId,
            birthdate,
            phone,
            city,
            government,
            StudentUniversityId: newStudentUniversityIdURL,
            CollegeEnrollmentStatement: newCollegeEnrollmentStatementURL,
          }, {
            new: true,
          })

        return {
          message: 'Traveler updated successfully',
          updateTraveler,
        }
      } else {
        const oldEmployeeCompanyId = userExist.EmployeeCompanyId.split('/').pop();
        fs.unlink(`./src/uploads/Traveler/EmployeeCompanyId/${oldEmployeeCompanyId}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
        let newEmployeeCompanyIdURL = `${req.protocol}://${req.headers.host}/${req.destination3}/${req.files.EmployeeCompanyId[0].filename}`
        const updateTraveler = await User.findByIdAndUpdate(
          id, {
            NationalId,
            birthdate,
            phone,
            city,
            government,
            EmployeeCompanyId: newEmployeeCompanyIdURL,
          }, {
            new: true,
          })
        return {
          message: 'Traveler updated successfully',
          updateTraveler,
        }
      }
    } else {
      return {
        message: 'User is not a traveler',
      }
    }
  } catch (error) {
    return {
      message: 'Something went wrong',
      err: error.message,
    }
  }
};

module.exports = {
  Student,
  Employee,
  createTraveler,
  updateTraveler,
};
