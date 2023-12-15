require('dotenv').config()
const jwt = require('jsonwebtoken')
const {
  createUser,
  userWithEmailExists,
  findByEmail,
  isPasswordCorrect
} = require('../services/userService.2')
const Logger = require('../utils/logger')

const signup = async (req, res) => {
  const userData = {
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    gender: req.body.gender,
    dob: req.body.dob
  }

  try {
    const userExists = await userWithEmailExists(req.body.email)
    if (userExists) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email taken.'
      })
    }
  } catch (error) {
    Logger.error("signUp: An error occured while querying DB")
    Logger.error(error)
    return res.status(500).json({
      message: 'Error occured. Please try again.'
    })
  }
  
  try {
    await createUser(userData)
  } catch (e) {
    Logger.error("signup: An error occured while creating new user")
    Logger.error(e.message)
    return res.status(500).json({
      message: 'Error occured. Please try again.'
    })
  }
  
  return res.status(201).json({})
}

const login = async (req, res) => {
  let user;
  try {
    user = await findByEmail(req.body.email)
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Incorrect login credentials'
      })
    }
  } catch (error) {
    Logger.error("signUp: An error occured while querying DB")
    Logger.error(error)
    return res.status(500).json({
      message: 'Error occured. Please try again.'
    })
  }

  const isPasswordValid = await isPasswordCorrect(req.body.password, user.password)
  if (!isPasswordValid) {
    return res.status(400).json({
      status: 'fail',
      message: 'Incorrect login credentials'
    })
  }

  const JWT_SECRET = process.env.JWT_SECRET
  let token = jwt.sign(
    { id: user._id },
    JWT_SECRET,
    { expiresIn: '6h'}
  );

  return res.status(200).json({
    status: 'success',
    data: {
      user,
      token
    }
  })
}

const validateJWT = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({
      status: 'fail',
      data: {
        message: 'Please add authorization token to request header.'
      }
    })
  }

  const token = authorization.split(' ')[1]
  if (!token) {
    return res.status(400).json({
      status: 'fail',
      data: {
        message: 'Please add authorization token to request header.'
      }
    })
  }
  
  const JWT_SECRET = process.env.JWT_SECRET
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return res.status(400).json({
      status: 'fail',
      data: {
        message: 'Invalid token in request header.'
      }
    })
  }
  
  req.user = decoded.id
  return next()
}

module.exports = {
  signup,
  login,
  validateJWT
}