import { ToObjectOptions } from 'mongoose'

const URLS = {
  MONGO: process.env.MongoConnectionString ??= 'mongodb://localhost:27017/comp3006',
  PORT: (process.env.PORT != null) ? parseInt(process.env.PORT) : 9000
}

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
  mongoExcludeVersionToObjectOptions,
  mongoExcludeIdsToObjectOptions
}
