import { NextFunction, Request, Response } from 'express'
import { mock } from 'jest-mock-extended'
import { ApiError } from '../../../setup/exceptions'
import { exceptionHandler } from '../exceptionHandler'

describe('exceptionHandler', () => {
  it('returns a special message for an ApiError', () => {
    const mockRequest = mock<Request>()
    const mockJsonFunc = jest.fn()
    const mockStatus = jest.fn().mockReturnValue({ json: mockJsonFunc })
    const mockResponse = mock<Response>({ status: mockStatus })
    const mockNextFunction = mock<NextFunction>()
    const expectedErrorCode = 418
    const expectedErrorMessage = 'very bad things have happened and you should feel bad'
    const fakeError = new ApiError(expectedErrorMessage, expectedErrorCode)

    exceptionHandler(fakeError, mockRequest, mockResponse, mockNextFunction)

    expect(mockStatus).toHaveBeenCalledWith(expectedErrorCode)
    expect(mockJsonFunc).toHaveBeenCalledWith({ message: expectedErrorMessage })
  })

  it('returns a generic error if type is unrecognised', () => {
    const mockRequest = mock<Request>()
    const mockJsonFunc = jest.fn()
    const mockStatus = jest.fn().mockReturnValue({ json: mockJsonFunc })
    const mockResponse = mock<Response>({ status: mockStatus })
    const mockNextFunction = mock<NextFunction>()
    const expectedErrorMessage = 'very bad things have happened and you should feel bad'
    const fakeError = new Error(expectedErrorMessage)

    exceptionHandler(fakeError, mockRequest, mockResponse, mockNextFunction)

    expect(mockStatus).toHaveBeenCalledWith(500)
    expect(mockJsonFunc).toHaveBeenCalledWith({ message: expectedErrorMessage })
  })
})
