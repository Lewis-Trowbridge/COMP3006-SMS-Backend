import { ToObjectOptions } from 'mongoose'

const URLS = {
  // These can be fiddly - try switching them between 127.0.0.1 and localhost if the current one doesn't work.
  // Different node versions and different setups like different configurations.
  ALLOWED_ORIGIN: process.env.origin ??= 'http://localhost:4200',
  MONGO: process.env.MongoConnectionString ??= 'mongodb://127.0.0.1:27017/comp3006',
  PORT: (process.env.PORT != null) ? parseInt(process.env.PORT) : 9000
}

const sessionSecret = process.env.SessionSecret ??= 'secret'

const mongoExcludeVersionToObjectOptions: ToObjectOptions = {
  versionKey: false
}

const mongoExcludeIdsToObjectOptions: ToObjectOptions = {
  transform: (doc, ret) => {
    delete ret._id
  },
  versionKey: false
}

export {
  URLS,
  sessionSecret,
  mongoExcludeVersionToObjectOptions,
  mongoExcludeIdsToObjectOptions
}
