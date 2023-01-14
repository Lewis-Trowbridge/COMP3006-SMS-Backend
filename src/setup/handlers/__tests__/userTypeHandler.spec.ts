import { Request, Response } from 'express'
import { mock } from 'jest-mock-extended'
import { IUser, UserType } from '../../../models/User'
import { customerTypeRequiredHandler, loggedInRequiredHandler, staffTypeRequiredHandler } from '../userTypeHandler'

describe('User type handlers', () => {
  describe('loggedInRequiredHandler', () => {
    it('calls the next function when the user is logged in', () => {
      const mockRequest = mock<Request>({ session: { user: mock<IUser>() } })
      const mockResponse = mock<Response>()
      const mockNextFunction = jest.fn()

      loggedInRequiredHandler(mockRequest, mockResponse, mockNextFunction)

      expect(mockNextFunction).toHaveBeenCalled()
    })

    it('returns HTTP 401 and does not call next function when the user is not logged in', () => {
      const mockRequest = mock<Request>({ session: { user: undefined } })
      const mockSendStatus = jest.fn()
      const mockResponse = mock<Response>({ sendStatus: mockSendStatus })
      const mockNextFunction = jest.fn()

      loggedInRequiredHandler(mockRequest, mockResponse, mockNextFunction)

      expect(mockSendStatus).toHaveBeenNthCalledWith(1, 401)
      expect(mockNextFunction).not.toHaveBeenCalled()
    })
  })

  describe('customerTypeRequiredHandler', () => {
    it('calls the next function when the user is logged in as a customer', () => {
      const mockRequest = mock<Request>({ session: { user: mock<IUser>({ type: UserType.Customer }) } })
      const mockResponse = mock<Response>()
      const mockNextFunction = jest.fn()

      customerTypeRequiredHandler(mockRequest, mockResponse, mockNextFunction)

      expect(mockNextFunction).toHaveBeenCalled()
    })

    it('returns HTTP 403 and does not call next function when the user is not logged in as a customer', () => {
      const mockRequest = mock<Request>({ session: { user: mock<IUser>({ type: UserType.Staff }) } })
      const mockSendStatus = jest.fn()
      const mockResponse = mock<Response>({ sendStatus: mockSendStatus })
      const mockNextFunction = jest.fn()

      customerTypeRequiredHandler(mockRequest, mockResponse, mockNextFunction)

      expect(mockSendStatus).toHaveBeenNthCalledWith(1, 403)
      expect(mockNextFunction).not.toHaveBeenCalled()
    })
  })

  describe('staffTypeRequiredHandler', () => {
    it('calls the next function when the user is logged in as a staff member', () => {
      const mockRequest = mock<Request>({ session: { user: mock<IUser>({ type: UserType.Staff }) } })
      const mockResponse = mock<Response>()
      const mockNextFunction = jest.fn()

      staffTypeRequiredHandler(mockRequest, mockResponse, mockNextFunction)

      expect(mockNextFunction).toHaveBeenCalled()
    })

    it('returns HTTP 403 and does not call next function when the user is not logged in as a member of staff', () => {
      const mockRequest = mock<Request>({ session: { user: mock<IUser>({ type: UserType.Customer }) } })
      const mockSendStatus = jest.fn()
      const mockResponse = mock<Response>({ sendStatus: mockSendStatus })
      const mockNextFunction = jest.fn()

      staffTypeRequiredHandler(mockRequest, mockResponse, mockNextFunction)

      expect(mockSendStatus).toHaveBeenNthCalledWith(1, 403)
      expect(mockNextFunction).not.toHaveBeenCalled()
    })
  })
})
