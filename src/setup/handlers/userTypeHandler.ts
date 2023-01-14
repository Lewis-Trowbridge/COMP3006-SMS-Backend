import { NextFunction, Request, Response } from 'express'
import { UserType } from '../../models/User'

const trueOrReturnErrorCodeHelper = (req: Request, res: Response, next: NextFunction, condition: boolean, code: number): void => {
  if (condition) {
    next()
  } else {
    res.sendStatus(code)
  }
}

const loggedInRequiredHandler = (req: Request, res: Response, next: NextFunction): void => {
  trueOrReturnErrorCodeHelper(req, res, next, req.session.user !== undefined, 401)
}

const customerTypeRequiredHandler = (req: Request, res: Response, next: NextFunction): void => {
  trueOrReturnErrorCodeHelper(req, res, next, req.session.user?.type === UserType.Customer, 403)
}

const staffTypeRequiredHandler = (req: Request, res: Response, next: NextFunction): void => {
  trueOrReturnErrorCodeHelper(req, res, next, req.session.user?.type === UserType.Staff, 403)
}

export {
  loggedInRequiredHandler,
  customerTypeRequiredHandler,
  staffTypeRequiredHandler
}
