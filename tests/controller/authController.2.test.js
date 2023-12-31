const ObjectId = require('mongoose').Types.ObjectId
const { signup } = require('../../src/controllers/auth')
const User = require('../../src/models/user')
const { userWithEmailExists } = require('../../src/services/userService.1')

jest.mock('../../src/services/userService.1', () => {
  const originalUserService = jest.requireActual('../../src/services/userService.1')
  const partiallyMockedUserService = {
    userWithEmailExists: jest.fn().mockResolvedValue(true)
  }
  return { ...originalUserService, ...partiallyMockedUserService }
})

describe('authController2', () => {
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
  
      const mockRequest = { body: userObject }
      const mockResponse = {
        status: jest.fn().mockImplementation(() => {
          return {
            json: jest.fn()
          }
        }),
        json: jest.fn()
      }
      await signup(mockRequest, mockResponse)
  
      expect(mockResponse.status).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(400)
    })
  })
})