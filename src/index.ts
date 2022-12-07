import { connectionPromise, server } from './setup'

void connectionPromise.then(() => {
  server.listen(9000, () => {
    console.log('Server now listening on port 9000')
  })
})
