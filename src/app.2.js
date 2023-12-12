const dotenv = require('dotenv')

const NODE_ENV = process.env.NODE_ENV
if (NODE_ENV === 'dev') {
  dotenv.config({ path: 'dev.env'})
} else if (NODE_ENV === 'test') {
  dotenv.config({ path: 'test.env'})
} else {
  dotenv.config()
}

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
