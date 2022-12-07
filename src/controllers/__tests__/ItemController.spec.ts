import ItemService from '../../services/staff/ItemService'
import mocked = jest.mocked
import { createPost } from '../ItemController'
import { mock } from 'jest-mock-extended'
import { Request, Response } from 'express'
import { HydratedDocument } from 'mongoose'
import { IItem } from '../../models/staff/Item'

jest.mock('../../services/staff/ItemService')

const mockItemService = mocked(ItemService)

describe('ItemController', () => {
  it('calls ItemService with recieved values', async () => {
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
    await createPost(mockRequest, mockResponse)
    expect(mockItemService.prototype?.create).toHaveBeenCalledTimes(1)
    expect(mockItemService.prototype?.create).toHaveBeenNthCalledWith(1, expectedName, expectedBarcode, expectedPosition, expectedStock)
  })

  it('returns response from ItemService', async () => {
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
    mockItemService.prototype?.create.mockResolvedValue(expectedResponse)
    const mockJsonFunc = jest.fn()
    const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: mockJsonFunc }) })
    await createPost(mockRequest, mockResponse)
    expect(mockJsonFunc).toHaveBeenCalledTimes(1)
    expect(mockJsonFunc).toHaveBeenNthCalledWith(1, expectedResponse)
  })
})
