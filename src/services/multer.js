const multer = require('multer');
const path = require('path');
const fs = require('fs');

const validationType = {
  image: ['image/png', 'image/jpg', 'image/jpeg'],
  files: ['application/pdf'],
};

const multerHandelErrors = (error, req, res, next) => {
  if (error) {
    res.status(400).json({
      message: 'file too large',
      error,
    });
  } else {
    next();
  }
};

function multerFn(customDest, type) {
  if (!customDest || customDest == '') {
    // eslint-disable-next-line no-param-reassign
    customDest = 'GeneralData';
  }
  if(customDest == 'Traveler'){
  if (!fs.existsSync(path.join(__dirname, `../uploads/${customDest}/StudentUniversityId`))) {
    fs.mkdirSync(path.join(__dirname, `../uploads/${customDest}/StudentUniversityId`), {
      recursive: true,
    })
  }
  if (!fs.existsSync(path.join(__dirname, `../uploads/${customDest}/CollegeEnrollmentStatement`))) {
    fs.mkdirSync(path.join(__dirname, `../uploads/${customDest}/CollegeEnrollmentStatement`), {
      recursive: true,
    })
  }
  if (!fs.existsSync(path.join(__dirname, `../uploads/${customDest}/EmployeeCompanyId`))) {
    fs.mkdirSync(path.join(__dirname, `../uploads/${customDest}/EmployeeCompanyId`), {
      recursive: true,
    })
  }
  if (!fs.existsSync(path.join(__dirname, `../uploads/${customDest}/NationalIdCard`))) {
    fs.mkdirSync(path.join(__dirname, `../uploads/${customDest}/NationalIdCard`), {
      recursive: true,
    })
  }
}
  if(customDest == 'User'){
  if (!fs.existsSync(path.join(__dirname, `../uploads/${customDest}/ProfileImage`))) {
    fs.mkdirSync(path.join(__dirname, `../uploads/${customDest}/ProfileImage`), {
      recursive: true,
    })
  }
}

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'StudentUniversityId') {
        req.destination = `uploads/${customDest}/StudentUniversityId`;
        cb(null, path.join(__dirname, `../uploads/${customDest}/StudentUniversityId`));
      }
      if (file.fieldname === 'CollegeEnrollmentStatement') {
        req.destination2 = `uploads/${customDest}/CollegeEnrollmentStatement`;
        cb(null, path.join(__dirname, `../uploads/${customDest}/CollegeEnrollmentStatement`));
      }
      if (file.fieldname === 'EmployeeCompanyId') {
        req.destination3 = `uploads/${customDest}/EmployeeCompanyId`;
        cb(null, path.join(__dirname, `../uploads/${customDest}/EmployeeCompanyId`));
      }
      if (file.fieldname === 'NationalIdCard') {
        req.destination5 = `uploads/${customDest}/NationalIdCard`;
        cb(null, path.join(__dirname, `../uploads/${customDest}/NationalIdCard`));
      }
      if (file.fieldname === 'ProfileImage') {
        req.destination4 = `uploads/${customDest}/ProfileImage`;
        cb(null, path.join(__dirname, `../uploads/${customDest}/ProfileImage`));
      }
    },

    filename: (req, file, cb) => {
      if (file.fieldname === 'StudentUniversityId') {
        const fullName = `TravelerUniversityId-${new Date().getTime()}-${file.originalname}`;
        cb(null, fullName);
      }
      if (file.fieldname === 'CollegeEnrollmentStatement') {
        const fullName = `TravelerEnrollmentStatement-${new Date().getTime()}-${file.originalname}`;
        cb(null, fullName);
      }
      if (file.fieldname === 'EmployeeCompanyId') {
        const fullName = `TravelerCompanyId-${new Date().getTime()}-${file.originalname}`;
        cb(null, fullName);
      }
      if (file.fieldname === 'NationalIdCard') {
        const fullName = `TravelerNationalIdCard-${new Date().getTime()}-${file.originalname}`;
        cb(null, fullName);
      }
      if (file.fieldname === 'ProfileImage') {
        const fullName = `UserProfileImage-${new Date().getTime()}-${file.originalname}`;
        cb(null, fullName);
      }
    },
  })
  const fileFilter = (req, file, cb) => {
    if (type.includes(file.mimetype)) {
      cb(null, true);
    } else {
      req.fileUploadError = true;
      cb(null, false);
    }
  }
  return multer({
    storage,
    fileFilter,
    dest: path.join(__dirname, '../uploads'),
  }).fields([{
      name: 'StudentUniversityId',
      maxCount: 1,
    },
    {
      name: 'CollegeEnrollmentStatement',
      maxCount: 1,
    },
    {
      name: 'EmployeeCompanyId',
      maxCount: 1
    },
    {
      name: 'NationalIdCard',
      maxCount: 1
    },
    {
      name: 'ProfileImage',
      maxCount: 1
    }
  ])
}

module.exports = {
  multerFn,
  validationType,
  multerHandelErrors
};
