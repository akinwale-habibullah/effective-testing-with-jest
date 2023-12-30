const ObjectId = require('mongoose').Types.ObjectId
const bcrypt = require('bcrypt')
const mockingoose = require('mockingoose')
const { signup } = require('../../../src/controllers/auth')
const User = require('../../../src/models/user')

const createUserObject = () => ({
  firstName: 'First',
  middleName: 'middle',
  lastName: 'Last',
  email: 'testuser@demo.com',
  password: 'password',
})

const createDbUserObject = () => ({
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
})

const createMocks = (userObject) => {
  const mockRequest = { body: userObject }
  const mockResponse = {
    status: jest.fn().mockReturnValue({
      json: jest.fn()
    })
  }
  return [mockRequest, mockResponse]
}

const createMocksWithJsonResponse = (userObject) => {
  const mockRequest = { body: userObject }
  const mockJson = jest.fn()
  const mockResponse = {
    status: jest.fn().mockImplementation(() => {
      return {
        json: mockJson
      }
    }),
    json: jest.fn()
  }
  return [mockRequest, mockResponse, mockJson]
}

describe.skip('authController - 1', () => {
  describe('signup', () => {

    test('given user object, returns response with 201 status', async () => {
      const userObject = createUserObject()
      const dbUser = createDbUserObject()
      const [mockRequest, mockResponse] = createMocks(userObject)
      mockingoose(User).toReturn(undefined, 'findOne');
      mockingoose(User).toReturn(dbUser, 'save');
  
      await signup(mockRequest, mockResponse)
  
      expect(mockResponse.status).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(201)
    })

    test('given user object with email of an existing user, returns 400 status - 1', async () => {
      // Arrange
      const userObject = createUserObject()
      const dbUser = createDbUserObject()
      const [mockRequest, mockResponse, mockJson] = createMocksWithJsonResponse(userObject)
      mockingoose(User).toReturn(dbUser, 'findOne');

      // Act
      await signup(mockRequest, mockResponse)

      // Assert
      expect(mockResponse.status).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalled()
      expect(mockJson).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Email taken.'
      })
    })
  })
})