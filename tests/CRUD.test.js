const request=require('supertest')
const app=require('../src/app')
const { deleteOne } = require('../src/models/user.model')
const User=require('../src/models/user.model')
const Traveler = require('../src/models/traveler.model');
const fs = require('fs');
const path = require('path');

//User Test
const userPayload={
    name:'test',
    email:'test@gmail.com',
    password:'test12D34',
    confirmpassword:'test12D34'}
    jest.setTimeout(10000)
    beforeAll(async()=>{await User.deleteMany({})})
describe('User service',()=>{
    describe('Create user',()=>{
        it('Should create a new user',async()=>{
            await request(app).post('/v1/auth/register').send(userPayload).expect(201)


})
    })
})

const userPayload2={
  email:'test@gmail.com',
  password:'test12D34',
}
describe('User Login service',()=>{
    describe('Login user',()=>{
        it('Should login a user',async()=>{
          await request(app).post('/v1/auth/login').send(userPayload2).expect(200)
        })
    })
})

describe('User register with Email Already Exist',()=>{
    describe('Register user',()=>{
        it('Should not create a new user',async()=>{
          await request(app).post('/v1/auth/register').send(userPayload).expect(400)
        })
    })
})

const userPayload3={
  email:'test33@gmail.com',
  password:'test12D34'
}

describe('User Login with Email Not Exist',()=>{
    describe('Login user',()=>{
        it('Should not login a user',async()=>{
          await request(app).post('/v1/auth/login').send(userPayload3).expect(401)
        })
    })
}
)


const userPayload4={
  email:'test@gmail.com',
  password:'test12D34',
}
jest.setTimeout(10000)

describe('User service',()=>{
    describe('Get User',()=>{
        it('Should get user',async()=>{
            const user=await User.findOne({email:userPayload4.email})
            const res = await request(app).post('/v1/auth/login').send(userPayload4)
            const token=res.body.token;
            await request(app).get(`/v1/users/${user._id}`).set('Authorization',`Bearer ${token}`).expect(200)
})
    })
}
)

// delete user

const userPayload5={
  email:'test@gmail.com',
  password:'test12D34',
}
jest.setTimeout(10000)

describe('User service',()=>{
    describe('Delete User',()=>{
        it('Should delete user',async()=>{
            const user=await User.findOne({email:userPayload5.email})
            const res = await request(app).post('/v1/auth/login').send(userPayload5)
            const token=res.body.token;
            await request(app).delete(`/v1/users/${user._id}`).set('Authorization',`Bearer ${token}`).expect(204)
})
    })
}
)

//Traveler Test

const userPayloadd = {
  email: 'test@gmail.com',
  password: 'test12D34',
};

describe('Traveler service', () => {
  describe('Create Student traveler', () => {
    it('Should create a new Employee traveler', async () => {
      const res = await request(app).post('/v1/auth/login').send(userPayloadd).expect(200);
      const token = res.body.token;
      await request(app).patch('/v1/travelers/employee').set('Authorization', `Bearer ${token}`).expect(201);
    });
  });
});

describe('Traveler service', () => {
  describe('Create traveler', () => {
    it('Should create a new traveler', async () => {
      const res = await request(app).post('/v1/auth/login').send(userPayloadd).expect(200);
      const token = res.body.token;
      await request(app)
        .patch('/v1/travelers/create')
        .set('Authorization', `Bearer ${token}`)
        .field({
          NationalId: '1200580001514031',
          city: 'aaa',
          government: 'sss',
        })
        .attach('NationalIdCard', path.join(__dirname, 'images', '2.jpg'))
        .attach('EmployeeCompanyId', path.join(__dirname, 'images', '2.jpg'))
        .expect(201);
    });
  });
});
