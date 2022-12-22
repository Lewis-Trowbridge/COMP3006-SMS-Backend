import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

const validateRequest = async (req: Request, res: Response): Promise<Response | undefined> => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
}

export default validateRequest
