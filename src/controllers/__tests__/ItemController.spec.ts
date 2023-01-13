import ItemService from '../../services/staff/ItemService'
import mocked = jest.mocked
import { createPost, findByBarcodeGet, findByNameGet, listAllGet } from '../ItemController'
import { mock } from 'jest-mock-extended'
import { Request, Response } from 'express'
import { HydratedDocument } from 'mongoose'
import { IItem, Item } from '../../models/staff/Item'

jest.mock('../../services/staff/ItemService')

const mockItemService = mocked(ItemService)

describe('ItemController', () => {
  describe('createPost', () => {
    it('calls ItemService with received values', async () => {
      const expectedName = 'name'
      const expectedBarcode = 'barcode'
      const expectedPosition = 'position'
      const expectedStock = 0
      const expectedObject = {
        barcode: expectedBarcode,
        name: expectedName,
        position: expectedPosition,
        stock: expectedStock
      }
      const mockRequest = mock<Request>()
      mockRequest.body = expectedObject
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: jest.fn() }) })
      const expectedResponse = mock<HydratedDocument<IItem>>()
      mockItemService.prototype?.create.mockResolvedValue(expectedResponse)
      await createPost(mockRequest, mockResponse)
      expect(mockItemService.prototype?.create).toHaveBeenCalledTimes(1)
      expect(mockItemService.prototype?.create).toHaveBeenNthCalledWith(1, expectedName, expectedBarcode, expectedPosition, expectedStock)
    })

    it('returns response from ItemService create', async () => {
      const expectedName = 'name'
      const expectedBarcode = 'barcode'
      const expectedPosition = 'position'
      const expectedStock = 0
      const expectedObject = {
        barcode: expectedBarcode,
        name: expectedName,
        position: expectedPosition,
        stock: expectedStock
      }
      const mockRequest = mock<Request>()
      mockRequest.body = expectedObject
      const expectedResponse = mock<HydratedDocument<IItem>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockItemService.prototype?.create.mockResolvedValue(expectedResponse)
      const mockJsonFunc = jest.fn()
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: mockJsonFunc }) })

      await createPost(mockRequest, mockResponse)

      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, expectedResponse)
    })
  })

  describe('listAll', () => {
    it('returns response from service listAll', async () => {
      const mockRequest = mock<Request>()
      const expectedResponse = mock<HydratedDocument<IItem>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockItemService.prototype?.listAll.mockResolvedValue([expectedResponse])
      const mockJsonFunc = jest.fn()
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: mockJsonFunc }) })

      await listAllGet(mockRequest, mockResponse)

      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, [expectedResponse])
    })
  })

  describe('findByBarcodeGet', () => {
    it('returns the value when a non-null value is returned from ItemService', async () => {
      const expectedBarcode = 'barcode'
      const mockRequest = mock<Request<{}, {}, {}, { barcode: string }>>()
      mockRequest.query.barcode = expectedBarcode
      const expectedResponse = mock<HydratedDocument<IItem>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockItemService.prototype.findByBarcode.mockResolvedValue(expectedResponse)
      const mockJsonFunc = jest.fn()
      const mockStatusFunc = jest.fn().mockReturnValue({ json: mockJsonFunc })
      const mockResponse = mock<Response>({ status: mockStatusFunc })

      await findByBarcodeGet(mockRequest, mockResponse)

      expect(mockStatusFunc).toHaveBeenCalledTimes(1)
      expect(mockStatusFunc).toHaveBeenNthCalledWith(1, 200)
      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, expectedResponse)
    })

    it('returns 404 when a null value is returned from ItemService', async () => {
      const expectedBarcode = 'barcode'
      const mockRequest = mock<Request<{}, {}, {}, { barcode: string }>>()
      mockRequest.query.barcode = expectedBarcode
      const expectedResponse = null
      mockItemService.prototype.findByBarcode.mockResolvedValue(expectedResponse)
      const mockJsonFunc = jest.fn()
      const mockStatusFunc = jest.fn().mockReturnValue({ json: mockJsonFunc })
      const mockResponse = mock<Response>({ status: mockStatusFunc })

      await findByBarcodeGet(mockRequest, mockResponse)

      expect(mockStatusFunc).toHaveBeenCalledTimes(1)
      expect(mockStatusFunc).toHaveBeenNthCalledWith(1, 404)
      expect(mockJsonFunc).toHaveBeenCalledTimes(0)
    })
  })
  describe('findByNameGet', () => {
    it('returns the value when a non-null value is returned from ItemService', async () => {
      const expectedName = 'name'
      const mockRequest = mock<Request<{}, {}, {}, { name: string }>>({ query: { name: expectedName } })
      const expectedResponse = [mock<HydratedDocument<IItem>>()]
      expectedResponse[0].toObject.mockReturnValue(expectedResponse[0])
      mockItemService.prototype.findByName.mockResolvedValue(expectedResponse)
      const mockJsonFunc = jest.fn()
      const mockStatusFunc = jest.fn().mockReturnValue({ json: mockJsonFunc })
      const mockResponse = mock<Response>({ status: mockStatusFunc })

      await findByNameGet(mockRequest, mockResponse)

      expect(mockStatusFunc).toHaveBeenCalledTimes(1)
      expect(mockStatusFunc).toHaveBeenNthCalledWith(1, 200)
      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, { results: expectedResponse })
    })

    it('returns an empty list when a null value is returned from ItemService', async () => {
      const expectedName = 'name'
      const mockRequest = mock<Request<{}, {}, {}, { name: string }>>({ query: { name: expectedName } })
      const expectedResponse = null
      mockItemService.prototype.findByName.mockResolvedValue(expectedResponse)
      const mockJsonFunc = jest.fn()
      const mockStatusFunc = jest.fn().mockReturnValue({ json: mockJsonFunc })
      const mockResponse = mock<Response>({ status: mockStatusFunc })

      await findByNameGet(mockRequest, mockResponse)

      expect(mockStatusFunc).toHaveBeenCalledTimes(1)
      expect(mockStatusFunc).toHaveBeenNthCalledWith(1, 200)
      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, { results: [] })
    })
  })
})
