import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

const validateRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
  } else {
    next()
  }
}

export default validateRequest
