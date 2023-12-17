const jwt = require('jsonwebtoken')
const mockingoose = require('mockingoose')
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../../../src/models/user')
const { validateJWT } = require('../../../src/controllers/auth')


describe('validateJWT', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('given valid authorization token, calls next callback function', () => {
    jest.spyOn(jwt, 'verify').mockReturnValue({
      id: '6551322fa235a3190c6fa8bd'
    })
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
    let token = 'demo_token_to_be_verified_by_a_stub'
    const mockRequest = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    const mockResponse = {}
    const mockNext = jest.fn().mockImplementation(() => {})

    validateJWT(mockRequest, mockResponse, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(mockRequest.user).toEqual(dbUser._id.toString())
  })
  
  test('given jwt verify method, returns 400', () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('error')
    })
    let token = 'demo_token_to_be_verified_by_a_stub'
    const mockRequest = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    const mockResponse = {
      status: jest.fn().mockImplementation(() => {
        return {
          json: jest.fn()
        }
      })
    }
    const mockNext = jest.fn()

    validateJWT(mockRequest, mockResponse, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(400)
  })
})