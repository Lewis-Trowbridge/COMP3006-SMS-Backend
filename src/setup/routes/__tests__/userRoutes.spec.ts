import supertest from 'supertest'
import { connect, connection } from 'mongoose'
import mongoUnit from 'mongo-unit'
import bodyParser from 'body-parser'
import express from 'express'
import userRoutes from '../userRoutes'
import { User, UserType } from '../../../models/User'

beforeAll(async () => {
  await mongoUnit.start()
  await connect(mongoUnit.getUrl())
}, 30000)

const testApp = express()
testApp.use(bodyParser.json({}))
testApp.use('/users', userRoutes)

describe('User routes (Integration test)', () => {
  describe('POST /create', () => {
    it('create endpoint returns HTTP 201 on successful create', async () => {
      const request = supertest(testApp)

      const response = await request.post('/users/create')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ password: 'unhashed', username: 'username' })

      expect(response.statusCode).toBe(201)
    }, 10000)

    it('create endpoint returns HTTP 304 on duplicate user', async () => {
      const request = supertest(testApp)
      const existingUser = await User.create({ password: 'unhashed', type: UserType.Customer, username: 'user' })

      const response = await request.post('/users/create')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ password: 'unhashed', username: existingUser.username })

      expect(response.statusCode).toBe(304)
    }, 10000)
  })
})

afterEach(async () => {
  await mongoUnit.drop()
  await User.syncIndexes()
})

afterAll(async () => {
  await connection.close()
  await mongoUnit.stop()
})
