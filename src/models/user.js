const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  firstName: String,
  middleName: String,
  lastName: String,
  dob: Date,
  gender: {
    type: String,
    enum: [
      'M',
      'F',
      'U'
    ],
    default: 'U'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
