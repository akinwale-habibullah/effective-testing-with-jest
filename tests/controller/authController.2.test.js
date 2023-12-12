const ObjectId = require('mongoose').Types.ObjectId
const { signup } = require('../../src/controllers/auth')
const User = require('../../src/models/user')
const { userWithEmailExists } = require('../../src/services/8.userService')

jest.mock('../../src/services/8.userService', () => {
  const originalUserService = jest.requireActual('../../src/services/8.userService')
  const partiallyMockedUserService = {
    userWithEmailExists: jest.fn().mockResolvedValue(true)
  }
  return { ...originalUserService, ...partiallyMockedUserService }
})

describe('authController', () => {
  describe('signup using Jest.mock', () => {
    afterAll(() => {
      jest.clearAllMocks()
    })

    test('given user object with email of an existing user, returns 400 status - 1', async () => {
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
  
      const mockRequest = { body: userObject }
      const mockResponse = {
        status: jest.fn().mockReturnValue({
          json: jest.fn()
        })
      }
      await signup(mockRequest, mockResponse)
  
      expect(mockResponse.status).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(400)
    })
  })
})