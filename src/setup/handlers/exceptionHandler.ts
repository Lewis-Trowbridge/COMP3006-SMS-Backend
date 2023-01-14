import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../exceptions'

const exceptionHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof ApiError) {
    res.status(error.status).json({ message: error.message })
  } else {
    res.status(500).json({ message: error.message })
  }
}

export {
  exceptionHandler
}
