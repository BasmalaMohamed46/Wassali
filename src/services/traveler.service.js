const User = require('../models/user.model')
const fs = require('fs');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Traveler = require('../models/traveler.model');

const Student = async (id,res) => {
  // const id = req.user._id;
  const userExist = await User.findById(id)
  if (userExist) {
    const foundedTraveler=await Traveler.findOne({userId:id})
    if(foundedTraveler){
      res.status(httpStatus.NOT_FOUND).send('User is already a student');
    }
    else{
    const traveler=await Traveler.create({

      isStudent:true,
      userId:id
    })
    res.status(httpStatus.CREATED).send(traveler);
  }}
    else{
      res.status(httpStatus.NOT_FOUND).send('User not found');}
    }

;
const Employee = async (id,res) => {
  // const id = req.user._id;
  const userExist = await User.findById(id)
  if (userExist) {
    const foundedTraveler=await Traveler.findOne({userId:id})
    if(foundedTraveler){
      res.status(httpStatus.NOT_FOUND).send('User is already a Employee');
    }
    else{
    const traveler=await Traveler.create({

      isStudent:false,
      userId:id
    })
    res.status(httpStatus.CREATED).send(traveler);
  }}
    else{
      res.status(httpStatus.NOT_FOUND).send('User not found');}
    }


;

const createTraveler = async (id, req) => {
  try {
    // const id = req.user._id;
    const foundedTraveler = await Traveler.findOne({userId:id});
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
      if (foundedTraveler.isStudent) {
        let StudentUniversityId_URL = `${req.protocol}://${req.headers.host}/${req.destination}/${req.files.StudentUniversityId[0].filename}`;
        let CollegeEnrollmentStatement_URL = `${req.protocol}://${req.headers.host}/${req.destination2}/${req.files.CollegeEnrollmentStatement[0].filename}`;
        // console.log(StudentUniversityId_URL);
        const updatedUser = await Traveler.findByIdAndUpdate(
          foundedTraveler._id, {

            isTraveler: true,

            NationalId,
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
        const updatedUser = await Traveler.findByIdAndUpdate(
          foundedTraveler._id, {
            NationalId,
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
      phone,
      city,
      government
    } = req.body;

    const travelerExist=await Traveler.findOne({userId:id})
    if (travelerExist.isTraveler) {
      if (travelerExist.isStudent) {
        // console.log(userExist.StudentUniversityId.split('/').pop());
        const oldStudentUniversityId = travelerExist.StudentUniversityId.split('/').pop();
        const oldCollegeEnrollmentStatement = travelerExist.CollegeEnrollmentStatement.split('/').pop();
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
        const updateTraveler = await Traveler.findByIdAndUpdate(
          travelerExist._id, {
            NationalId,
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
        const oldEmployeeCompanyId = travelerExist.EmployeeCompanyId.split('/').pop();
        fs.unlink(`./src/uploads/Traveler/EmployeeCompanyId/${oldEmployeeCompanyId}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
        let newEmployeeCompanyIdURL = `${req.protocol}://${req.headers.host}/${req.destination3}/${req.files.EmployeeCompanyId[0].filename}`
        const updateTraveler = await Traveler.findByIdAndUpdate(
          travelerExist._id, {
            NationalId,
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
const deleteTraveler = async (id,res) => {
  try{
    const foundedTraveler=await Traveler.findOne({userId:id});
    if(foundedTraveler){
    const traveler=await Traveler.findOneAndDelete({userId:id});
    res.status(httpStatus.OK).json({
      message: 'Traveler deleted successfully',
      traveler
    })
  }
  else{
    res.status(httpStatus.NOT_FOUND).json({
      message: 'Traveler not found',
    })

  }}
  catch(error){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      err: error.message,
    })
  }

}
const viewTraveler = async (id,res) => {
  try{
    const user=await User.findById(id);
     const traveler=await Traveler.findOne({userId:id});
      if(traveler){
        res.status(httpStatus.OK).json({
          message: 'Traveler found',
          traveler,
          user
        })
      }
      else{
        res.status(httpStatus.NOT_FOUND).json({
          message: 'Traveler not found',
        })
      }
  }
  catch(error){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      err: error.message,
    })
  }
}


module.exports = {
  Student,
  Employee,
  createTraveler,
  updateTraveler,
  deleteTraveler,
  viewTraveler,
};
