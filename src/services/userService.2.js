const bcrypt = require('bcrypt')
const User = require('../models/user')

const isPasswordCorrect = async (passwordString, hashString) => {
  return await bcrypt.compare(passwordString, hashString)
}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

const createUser = async (userObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hash = await hashPassword(userObject.password)
      const user = new User({ ...userObject, password: hash })
      const newUser = await user.save()
      return resolve(newUser)  
    } catch (err) {
      return reject(err)
    }
  })
}

const userWithEmailExists = async (email) => {
  const user = await User.findOne({ email })
  if (user) {
    return true
  }

  return false
}

const findByEmail = async (email) => {
  return await User.findOne({ email })
}

module.exports = {
  isPasswordCorrect,
  hashPassword,
  createUser,
  userWithEmailExists,
  findByEmail
}
