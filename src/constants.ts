const URLS = {
  MONGO: process.env.MongoConnectionString ??= 'mongodb://localhost:27017/comp3006',
  PORT: (process.env.PORT != null) ? parseInt(process.env.PORT) : 9000
}

export {
  URLS
}
