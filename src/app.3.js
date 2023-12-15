const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const {
  authRouter,
  recipeRouter
} = require('./routes/index.1');

const NODE_ENV = process.env.NODE_ENV
if (NODE_ENV === 'dev') {
  dotenv.config({ path: 'dev.env'})
} else if (NODE_ENV === 'test') {
  dotenv.config({ path: 'test.env'})
} else {
  dotenv.config()
}

const app = express()
let port = process.env.PORT || 3000
if (NODE_ENV === 'test') {
  port = process.env.JEST_WORKER_ID
}
let MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI, { minPoolSize: 5, maxPoolSize: 10 });
const connection = mongoose.connection;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to myRecipe API')
})
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/recipes', recipeRouter);

const server = app.listen(port, () => {
  console.log(`myRecipe app listening on port ${port}`)
})

module.exports = {
  server,
  connection
}
