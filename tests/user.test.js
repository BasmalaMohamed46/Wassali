const request=require('supertest')
const app=require('../src/app')
const { deleteOne } = require('../src/models/user.model')
const user=require('../src/models/user.model')

const userPayload={
    name:'test',
    email:'test@gmail.com',
    password:'test12D34',
    confirmpassword:'test12D34'}
    jest.setTimeout(10000)
    beforeAll(async()=>{await user.deleteMany({})})
describe('User service',()=>{
    describe('Create user',()=>{
        it('Should create a new user',async()=>{
            await request(app).post('/v1/auth/register').send(userPayload).expect(201)
         

})
    }) 
})

