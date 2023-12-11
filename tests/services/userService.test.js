const bcrypt = require('bcrypt')
const { isPasswordCorrect, hashPassword } = require('../../src/services/userService')

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
})