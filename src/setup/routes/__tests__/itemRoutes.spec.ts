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
  describe('POST /create', () => {
    it('create endpointreturns HTTP 201 and model value', async () => {
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

    it('returns HTTP 400 when given a stock number below 0', async () => {
      const request = supertest(testApp)
      const invalidValue = -1
      const testRequestObject = {
        barcode: 'barcode',
        name: 'name',
        position: 'position',
        stock: invalidValue
      }

      const expectedError = {
        errors: [
          {
            location: 'body',
            msg: 'Invalid value',
            param: 'stock',
            value: invalidValue
          }
        ]
      }
      const response = await request.post('/items/create')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(testRequestObject)

      expect(response.status).toBe(400)
      expect(response.body).toEqual(expectedError)
    }, 10000)

    it('returns HTTP 400 when given an empty string', async () => {
      const request = supertest(testApp)
      const invalidValue = ''
      const testRequestObject = {
        barcode: invalidValue,
        name: invalidValue,
        position: invalidValue,
        stock: 0
      }

      const expectedError = {
        errors: [
          {
            location: 'body',
            msg: 'Invalid value',
            param: 'name',
            value: invalidValue
          },
          {
            location: 'body',
            msg: 'Invalid value',
            param: 'barcode',
            value: invalidValue
          },
          {
            location: 'body',
            msg: 'Invalid value',
            param: 'position',
            value: invalidValue
          }
        ]
      }
      const response = await request.post('/items/create')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(testRequestObject)

      expect(response.status).toBe(400)
      expect(response.body).toEqual(expectedError)
    }, 10000)
  })

  it('returns HTTP 400 when values are not supplied', async () => {
    const request = supertest(testApp)
    const testRequestObject = {
    }

    const expectedError = {
      errors: [
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'name'
        },
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'barcode'
        },
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'position'
        },
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'stock'
        }
      ]
    }
    const response = await request.post('/items/create')
      .type('form')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(testRequestObject)

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expectedError)
  })
})

afterEach(async () => {
  await mongoUnit.drop()
})

afterAll(async () => {
  await connection.close()
  await mongoUnit.stop()
})
