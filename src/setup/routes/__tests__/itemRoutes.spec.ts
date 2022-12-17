import supertest from 'supertest'
import itemRoutes from '../itemRoutes'
import { connect, connection } from 'mongoose'
import mongoUnit from 'mongo-unit'
import bodyParser from 'body-parser'
import express from 'express'

beforeAll(async () => {
  await mongoUnit.start()
  await connect(mongoUnit.getUrl())
}, 30000)

const testApp = express()
testApp.use(bodyParser.json({}))
testApp.use('/items', itemRoutes)

describe('Item routes (integration tests)', () => {
  it('returns HTTP 201 and model value from create endpoint', async () => {
    const request = supertest(testApp)
    const expectedObject = {
      barcode: 'barcode',
      name: 'name',
      position: 'position',
      stock: 0
    }
    const response = await request.post('/items/create')
      .type('form')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(expectedObject)

    expect(response.status).toBe(201)
    expect(response.body).toEqual(expectedObject)
  }, 10000)
})

afterEach(async () => {
  await mongoUnit.drop()
})

afterAll(async () => {
  await connection.close()
  await mongoUnit.stop()
})
