import supertest from 'supertest'
import itemRoutes from '../itemRoutes'
import { connect, connection, Types } from 'mongoose'
import mongoUnit from 'mongo-unit'
import bodyParser from 'body-parser'
import express from 'express'
import { Item } from '../../../models/staff/Item'

beforeAll(async () => {
  await mongoUnit.start()
  await connect(mongoUnit.getUrl())
}, 30000)

const validItemObject = {
  _id: new Types.ObjectId().toString(),
  barcode: 'barcode',
  name: 'name',
  position: 'position',
  stock: 0
}

const unknownIdValidItemObject = {
  ...validItemObject,
  _id: expect.any(String)
}

const testApp = express()
testApp.use(bodyParser.json({}))
testApp.use('/items', itemRoutes)

describe('Item routes (integration tests)', () => {
  describe('POST /create', () => {
    it('create endpoint returns HTTP 201 and model value', async () => {
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
      expect(response.body).toEqual(unknownIdValidItemObject)
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
    const testRequestObject = {}

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

  describe('GET /list-all', () => {
    it('returns HTTP 200 and valid response with valid data', async () => {
      const request = supertest(testApp)
      await Item.create(validItemObject)

      const response = await request.get('/items/list-all')
        .send()

      expect(response.status).toBe(200)
      expect(response.body).toEqual([validItemObject])
    })
  })

  describe('GET /find-barcode', () => {
    it('returns HTTP 200 and valid response with valid data', async () => {
      const request = supertest(testApp)
      const expectedItem = await Item.create(validItemObject)

      const response = await request.get('/items/find-barcode')
        .query({ barcode: expectedItem.barcode })
        .send()

      expect(response.status).toBe(200)
      expect(response.body).toEqual(validItemObject)
    }, 10000)

    it('returns HTTP 400 with empty barcode', async () => {
      const invalidValue = ''
      const expectedErrors = {
        errors: [
          {
            location: 'query',
            msg: 'Invalid value',
            param: 'barcode',
            value: invalidValue
          }
        ]
      }

      const request = supertest(testApp)

      const response = await request.get('/items/find-barcode')
        .query({ barcode: invalidValue })
        .send()

      expect(response.status).toBe(400)
      expect(response.body).toEqual(expectedErrors)
    }, 10000)

    it('returns HTTP 400 with missing barcode', async () => {
      const expectedErrors = {
        errors: [
          {
            location: 'query',
            msg: 'Invalid value',
            param: 'barcode'
          }
        ]
      }

      const request = supertest(testApp)

      const response = await request.get('/items/find-barcode')
        .send()

      expect(response.status).toBe(400)
      expect(response.body).toEqual(expectedErrors)
    }, 10000)
  })

  describe('GET /find-name', () => {
    it('returns HTTP 200 and valid response with valid data', async () => {
      const request = supertest(testApp)
      const expectedItem = await Item.create(validItemObject)

      const response = await request.get('/items/find-name')
        .query({ name: expectedItem.name })
        .send()

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ results: [validItemObject] })
    }, 10000)

    it('returns HTTP 400 with empty name', async () => {
      const invalidValue = ''
      const expectedErrors = {
        errors: [
          {
            location: 'query',
            msg: 'Invalid value',
            param: 'name',
            value: invalidValue
          }
        ]
      }

      const request = supertest(testApp)

      const response = await request.get('/items/find-name')
        .query({ name: invalidValue })
        .send()

      expect(response.status).toBe(400)
      expect(response.body).toEqual(expectedErrors)
    }, 10000)

    it('returns HTTP 400 with missing name', async () => {
      const expectedErrors = {
        errors: [
          {
            location: 'query',
            msg: 'Invalid value',
            param: 'name'
          }
        ]
      }

      const request = supertest(testApp)

      const response = await request.get('/items/find-name')
        .send()

      expect(response.status).toBe(400)
      expect(response.body).toEqual(expectedErrors)
    }, 10000)
  })
})

afterEach(async () => {
  await mongoUnit.drop()
})

afterAll(async () => {
  await connection.close()
  await mongoUnit.stop()
})
