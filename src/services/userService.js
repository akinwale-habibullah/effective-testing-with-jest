const bcrypt = require('bcrypt')

const isPasswordCorrect = async (passwordString, hashString) => {
  return await bcrypt.compare(passwordString, hashString)
}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

module.exports = {
  isPasswordCorrect,
  hashPassword
}
