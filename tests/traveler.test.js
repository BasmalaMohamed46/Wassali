const request=require('supertest')
const app=require('../src/app')
const { deleteOne } = require('../src/models/traveler.model')
const Traveler=require('../src/models/traveler.model')
const User=require('../src/models/user.model')
const fs=require('fs')
const path=require('path')

const userPayload={
  email:'test@gmail.com',
  password:'test12D34',
}
describe('Traveler service',()=>{
  describe('Create Student traveler',()=>{
    it('Should create a new Student traveler',async()=>{
      const res= await request(app).post('/v1/auth/login').send(userPayload).expect(200)
      const token = res.body.token
      await request(app).put('/v1/travelers/student').set('Authorization',`Bearer ${token}`).expect(201)
    })
  })
}
)
jest.setTimeout(20000)
beforeAll(async()=>{await Traveler.deleteMany({})})

describe('Traveler service',()=>{
  describe('Create traveler',()=>{
    it('Should create a new traveler',async()=>{
      const res= await request(app).post('/v1/auth/login').send(userPayload).expect(200)
      const token = res.body.token;
      const user=await User.findOne({email:userPayload.email})
      await Traveler.findOne({
        userId:user._id
      })
      console.log(user._id);
      await request(app).patch('/v1/travelers/create').set('Authorization',`Bearer ${token}`)
      .field({
        NationalId:'123456789',
        city:'aaa',
        government:'sss',
      })
      .attach('StudentUniversityId',path.join(__dirname,'images','2.jpg'))
      .attach('CollegeEnrollmentStatement',path.join(__dirname,'images','2.jpg'))
      .attach('NationalIdCard',path.join(__dirname,'images','2.jpg'))
      .expect(200)
    })
  })
}
)
