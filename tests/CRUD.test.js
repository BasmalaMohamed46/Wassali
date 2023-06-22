const request = require('supertest');
const app = require('../src/app');
const { deleteOne } = require('../src/models/user.model');
const User = require('../src/models/user.model');
const Traveler = require('../src/models/traveler.model');
const Request = require('../src/models/request.model');
const Trip = require('../src/models/trip.model');
const fs = require('fs');
const path = require('path');

// User Test
const userPayload = {
  name: 'test',
  email: 'basmalazain22@gmail.com',
  password: 'test12D34',
  confirmpassword: 'test12D34',
  phoneNumber: '01205974265',
};
//     jest.setTimeout(10000)
//     beforeAll(async()=>{await User.deleteMany({})})
//     describe('User service',()=>{
//     describe('Create user',()=>{
//         it('Should create a new user',async()=>{
//             await request(app).post('/v1/auth/register').send(userPayload).expect(201)
// })
//     })
// })

const userPayload2 = {
  email: 'basmalazain22@gmail.com',
  password: 'test12D34',
};
describe('User Login service', () => {
  describe('Login user', () => {
    it('Should login a user', async () => {
      await request(app).post('/v1/auth/login').send(userPayload2).expect(200);
    });
  });
});

describe('User register with Email Already Exist', () => {
  describe('Register user', () => {
    it('Should not create a new user', async () => {
      await request(app).post('/v1/auth/register').send(userPayload).expect(400);
    });
  });
});

const userPayload3 = {
  email: 'test33@gmail.com',
  password: 'test12D34',
};

describe('User Login with Email Not Exist',()=>{
    describe('Login user',()=>{
        it('Should not login a user',async()=>{
          await request(app).post('/v1/auth/login').send(userPayload3).expect(500)
        })
    })
}
)

jest.setTimeout(10000);

describe('User service', () => {
  describe('Get User', () => {
    it('Should get user', async () => {
      const user = await User.findOne({ email: userPayload.email });
      const res = await request(app).post('/v1/auth/login').send(userPayload);
      const token = res.body.token;
      await request(app).get(`/v1/users/${user._id}`).set('Authorization', `Bearer ${token}`).expect(200);
    });
  });
});

// // // delete user

// const userPayload5={
//   email:'test@gmail.com',
//   password:'test12D34',
// }
// jest.setTimeout(10000)

// describe('User service',()=>{
//     describe('Delete User',()=>{
//         it('Should delete user',async()=>{
//             const user=await User.findOne({email:userPayload5.email})
//             const res = await request(app).post('/v1/auth/login').send(userPayload5)
//             const token=res.body.token;
//             await request(app).delete(`/v1/users/${user._id}`).set('Authorization',`Bearer ${token}`).expect(204)
// })
//     })
// }
// )

//Traveler Test

const travelerPayload = {
  name: 'test',
  email: 'basmalazayn46@gmail.com',
  password: 'test12D34',
  confirmpassword: 'test12D34',
  phoneNumber: '01205974265',
};
//     jest.setTimeout(10000)
//     beforeAll(async()=>{await User.deleteMany({})})
//     describe('traveler service',()=>{
//     describe('Create traveler',()=>{
//         it('Should create a new traveler',async()=>{
//             await request(app).post('/v1/auth/register').send(travelerPayload).expect(201)

// })
//     })
// })

const travelerPayload2 = {
  email: 'basmalazayn46@gmail.com',
  password: 'test12D34',
};
describe('traveler Login service', () => {
  describe('Login traveler', () => {
    it('Should login a traveler', async () => {
      await request(app).post('/v1/auth/login').send(travelerPayload2).expect(200);
    });
  });
});

beforeAll(async () => {
  await Traveler.deleteMany({});
});
describe('Traveler service', () => {
  describe('Create Employee traveler', () => {
    it('Should create a new Employee traveler', async () => {
      const res = await request(app).post('/v1/auth/login').send(travelerPayload2).expect(200);
      const token = res.body.token;
      await request(app).patch('/v1/travelers/employee').set('Authorization', `Bearer ${token}`).expect(201);
    });
  });
});

describe('Traveler service', () => {
  describe('Create traveler', () => {
    it('Should create a new traveler', async () => {
      const res = await request(app).post('/v1/auth/login').send(travelerPayload2).expect(200);
      const token = res.body.token;
      await request(app)
        .patch('/v1/travelers/create')
        .set('Authorization', `Bearer ${token}`)
        .field({
          NationalId: '30101010229605',
        })
        .attach('NationalIdCard', path.join(__dirname, 'images', '2.jpg'))
        .attach('EmployeeCompanyId', path.join(__dirname, 'images', '2.jpg'))
        .expect(200);
    });
  });
});

let payloadAdmin = {
  email: 'admin@gmail.com',
  password: 'test12D34',
};

describe('Admin service', () => {
  describe('Admin verify traveler', () => {
    it('Should verify an existing traveler', async () => {
      const res = await request(app).post('/v1/admins/login').send(payloadAdmin).expect(200);
      const token = res.body.token;
      const user = await User.findOne({ email: travelerPayload2.email });
      const traveler = await Traveler.findOne({
        userId: user._id,
      });
      const travelerId = traveler._id;
      await request(app)
        .patch(`/v1/admins/verifyDocuments/${travelerId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});

jest.setTimeout(10000);
describe('Traveler service', () => {
  describe('Update traveler', () => {
    it('Should update an existing traveler', async () => {
      const res = await request(app).post('/v1/auth/login').send(travelerPayload2).expect(200);
      const token = res.body.token;
      await request(app)
        .patch('/v1/travelers/update')
        .set('Authorization', `Bearer ${token}`)
        .field({
          NationalId: '1200580001514037',
          city: 'alex12345',
          government: 'cairo',
        })
        .attach('NationalIdCard', path.join(__dirname, 'images', '2.jpg'))
        .attach('EmployeeCompanyId', path.join(__dirname, 'images', '2.jpg'))
        .expect(200);
    });
  });
});

describe('Traveler service', () => {
  describe('View traveler', () => {
    it('Should view an existing traveler', async () => {
      const res = await request(app).post('/v1/auth/login').send(travelerPayload2).expect(200);
      const token = res.body.token;
      await request(app).get('/v1/travelers/get').set('Authorization', `Bearer ${token}`).expect(200);
    });
  });
});

describe('Traveler service', () => {
  describe('get traveler own requests', () => {
    it('Should get traveler own requests', async () => {
      const res = await request(app).post('/v1/auth/login').send(travelerPayload2).expect(200);
      const token = res.body.token;
      await request(app).get('/v1/travelers/getTravellerOwnRequests').set('Authorization', `Bearer ${token}`).expect(200);
    });
  });
});

//Trip test

beforeAll(async () => {
  await Trip.deleteMany({});
});
jest.setTimeout(10000);
describe('Trip service', () => {
  describe('Create trip', () => {
    it('Should create a new trip', async () => {
      const res = await request(app).post('/v1/auth/login').send(travelerPayload2).expect(200);
      const token = res.body.token;
      await request(app)
        .post('/v1/trips/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          from: 'cairo',
          to: 'alex',
          TripDate: '2024-03-28',
          AvailableWeight: 4,
          unAcceptablaPackage: 'electronics',
          TripTime: '5 pm',
        })
        .expect(201);
    });
  });
});

describe('Trip service', () => {
  describe('Update trip', () => {
    it('Should update an existing trip', async () => {
      const res = await request(app).post('/v1/auth/login').send(travelerPayload2).expect(200);
      const token = res.body.token;
      const user = await User.findOne({ email: travelerPayload2.email });
      const traveler = await Traveler.findOne({ userId: user._id });
      const trip = await Trip.findOne({ Traveler: traveler._id });
      await request(app)
        .put(`/v1/trips/update/${trip._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          from: 'cairo',
          to: 'alex',
          TripDate: '2024-03-28',
          AvailableWeight: 4,
          unAcceptablaPackage: 'mobile',
          TripTime: '8 pm',
        })
        .expect(201);
    });
  });
});

describe('Trip service', () => {
  describe('View traveler trips', () => {
    it('Should view traveler trips', async () => {
      const res = await request(app).post('/v1/auth/login').send(travelerPayload2).expect(200);
      const token = res.body.token;
      await request(app).get(`/v1/trips/viewtravelertrips`).set('Authorization', `Bearer ${token}`).expect(200);
    });
  });
});

describe('Trip service', () => {
  describe('View  trips', () => {
    it('Should view  trips', async () => {
      const res = await request(app).post('/v1/auth/login').send(travelerPayload2).expect(200);
      const token = res.body.token;
      await request(app).get(`/v1/trips/view`).set('Authorization', `Bearer ${token}`).expect(200);
    });
  });
});

describe('Trip service', () => {
  describe('View trip', () => {
    it('Should view an existing trip', async () => {
      const res = await request(app).post('/v1/auth/login').send(travelerPayload2).expect(200);
      const token = res.body.token;
      const user = await User.findOne({ email: travelerPayload2.email });
      const traveler = await Traveler.findOne({ userId: user._id });
      const trip = await Trip.findOne({ Traveler: traveler._id });
      await request(app).get(`/v1/trips/viewtrip/${trip._id}`).set('Authorization', `Bearer ${token}`).expect(200);
    });
  });
});

// //Request Test

const userPayloadd = {
  email: 'basmalazain22@gmail.com',
  password: 'test12D34',
};

beforeAll(async () => {
  await Request.deleteMany({});
});

describe('Request service', () => {
  describe('Send request', () => {
    it('Should Send Request', async () => {
      const res = await request(app).post('/v1/auth/login').send(userPayloadd).expect(200);
      const token = res.body.token;
      const user = await User.findOne({ email: travelerPayload2.email });
      const traveler = await Traveler.findOne({ userId: user._id });
      const trip = await Trip.findOne({ Traveler: traveler._id });
      console.log(trip._id);
      await request(app)
        .post(`/v1/requests/sendrequest/${trip._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          to: 'cairo',
          from: 'alex',
          item: 'fff',
          weight: '33',
          location: 'gggg',
          targetLocation: 'jdjdjd',
          category: 'bags',
          buyOrdeliver: 'deliver',
          date: '2024-05-20',
        })
        .expect(201);
    });
  });
});

describe('Request service', () => {
  describe('Accept specific request', () => {
    it('Should accept specific request', async () => {
      const user = await User.findOne({ email: userPayloadd.email });
      const requests = await Request.findOne({ userId: user._id });
      const res = await request(app).post('/v1/auth/login').send(travelerPayload2).expect(200);
      const token = res.body.token;
      await request(app)
        .post(`/v1/requests/acceptrequest/${requests._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
    });
  });
});

describe('Request service', () => {
  describe('Update request', () => {
    it('Should update request', async () => {
      const res = await request(app).post('/v1/auth/login').send(userPayloadd).expect(200);
      const token = res.body.token;
      const user = await User.findOne({ email: userPayloadd.email });
      const requests = await Request.findOne({ userId: user._id });
      console.log(requests._id);
      await request(app)
        .patch(`/v1/requests/${requests._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          to: 'kafr el-sheikh',
          from: 'Cairo',
          item: 'bag',
          weight: '19',
          location: 'gggg',
          targetLocation: 'jdjdjd',
          category: 'bags',
          date: '2024-03-30',
        })
        .expect(200);
    });
  });
});

describe('Request service', () => {
  describe('View Request', () => {
    it('Should view Request', async () => {
      const res = await request(app).post('/v1/auth/login').send(userPayloadd).expect(200);
      const token = res.body.token;
      await request(app).get(`/v1/requests/viewAllRequests`).set('Authorization', `Bearer ${token}`).expect(201);
    });
  });
});

describe('Request service', () => {
  describe('View user Requests', () => {
    it('Should view user Requests', async () => {
      const res = await request(app).post('/v1/auth/login').send(userPayloadd).expect(200);
      const token = res.body.token;
      await request(app).get(`/v1/requests/userviewrequests`).set('Authorization', `Bearer ${token}`).expect(200);
    });
  });
});

describe('Request service', () => {
  describe('View user Request', () => {
    it('Should view user Request', async () => {
      const res = await request(app).post('/v1/auth/login').send(userPayloadd).expect(200);
      const token = res.body.token;
      const user = await User.findOne({ email: userPayloadd.email });
      const requests = await Request.findOne({ userId: user._id });
      await request(app)
        .get(`/v1/requests/userviewrequest/${requests._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
    });
  });
});
