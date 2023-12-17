const ObjectId = require('mongoose').Types.ObjectId
const bcrypt = require('bcrypt')
const mockingoose = require('mockingoose')
const { isPasswordCorrect, hashPassword, createUser } = require('../../../src/services/userService')
const User = require('../../../src/models/user')

describe('userService', () => {
  describe('isPasswordCorrect', () => {
    test('given password and hash, returns true', async () => {
      // Arrange
      const password = 'password'
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      
      // Act
      const result = await isPasswordCorrect(password, hash)
    
      // Assert
      expect(result).toBe(true)
    })
  
    test('given wrong password and hash, returns false', async () => {
      // Arrange
      const password = 'password'
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
    
      // Act
      const result = await isPasswordCorrect('wrongpassword', hash)
    
      // Assert
      expect(result).toBe(false)
    })

    test('executes bcrypt compare function', () => {
      // Arrange
      const spy = jest.spyOn(bcrypt, 'compare')
      
      // Act
      isPasswordCorrect('password', 'hash')
      
      // Assert
      expect(spy).toHaveBeenCalledWith('password', 'hash')
      expect(spy).toHaveBeenCalled()
      const calls = spy.mock.calls
      expect(calls[0][0]).toBe('password')
      expect(calls[0][1]).toBe('hash')
      
      spy.mockClear()
      spy.mockRestore()
    })

    test('given false compare return value, returns false', async () => {
      // const spy = jest.spyOn(bcrypt, 'compare').mockImplementation(() => false)
      const spy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false)

      const result = await isPasswordCorrect('password', 'hash')

      expect(result).toBe(false)
      spy.mockReset()
      spy.mockRestore()
    })
  })
  
  describe('hashPassword', () => {
    test('given password string, returns hashedPassword', async () => {
      // Arrange
      const password = 'password'
  
      // Act
      const hash = await hashPassword(password)
  
      // Assert
      const result = await bcrypt.compare('password', hash)
      expect(result).toBe(true)
    })
  })

  describe('createUser', () => {
    test('given a user object, adds the user to the database', async () => {
      const userObject = {
        firstName: 'First',
        middleName: 'middle',
        lastName: 'Last',
        email: 'testuser@demo.com',
        password: 'password',
      }
      const dbUser = {
        email: 'testuser@demo.com',
        password: '$2b$10$IWaPIV2k1c/Cn53UsVNnFOd0CWedQmEeF.B.XFeUGIfL7OpJVZuXG',
        firstName: 'First',
        middleName: 'middle',
        lastName: 'Last',
        gender: 'U',
        _id: new ObjectId('6551322fa235a3190c6fa8bd'),
        created_at: '2023-11-12T20:14:39.783Z',
        updated_at: '2023-11-12T20:14:39.783Z',
        __v: 0
      }
      mockingoose(User).toReturn(dbUser, 'save');
  
      const newUser = await createUser(userObject)
    
      expect(newUser.email).toEqual(dbUser.email)
      expect(newUser.firstName).toEqual(dbUser.firstName)
      expect(newUser.lastName).toEqual(dbUser.lastName)
      expect(newUser._id.toString()).toEqual(dbUser._id.toString())
    })
  })
})