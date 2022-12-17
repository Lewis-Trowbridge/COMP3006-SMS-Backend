import { connectionPromise, server } from './setup'
import { URLS } from './constants'

void connectionPromise.then(() => {
  server.listen(URLS.PORT, () => {
    console.log('Server now listening on port 9000')
  })
})
