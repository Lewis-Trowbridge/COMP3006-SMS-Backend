class ApiError extends Error {
  constructor (public message: string, public status: number) {
    super(message)
  }
}

class Api404Error extends ApiError {
  constructor (public message: string = 'Value not found.') {
    super(message, 404)
  }
}

class Api304Error extends ApiError {
  constructor (public message: string = 'Object not updated.') {
    super(message, 304)
  }
}

export {
  ApiError,
  Api304Error,
  Api404Error
}
