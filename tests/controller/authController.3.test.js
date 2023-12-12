const jwt = require('jsonwebtoken')
const mockingoose = require('mockingoose')
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../../src/models/User')
const { validateJWT } = require('../../src/controllers/auth')


describe('validateJWT', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
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
    const mockResponse = jest.fn()
    const mockNext = jest.fn()

    validateJWT(mockRequest, mockResponse, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(mockRequest.user).toEqual(dbUser._id.toString())
  })
  
  test('given jwt verify method throws an error, returns 400', () => {
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
      status: jest.fn().mockReturnValue({
        json: jest.fn()
      })
    }
    const mockNext = jest.fn()

    validateJWT(mockRequest, mockResponse, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(400)
  })

  test('given valid authorization token, calls next callback function', () => {
    const JWT_SECRET = process.env.JWT_SECRET
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
    let token = jwt.sign(
      { id: dbUser._id.toString() },
      JWT_SECRET,
      { expiresIn: '1h'}
    );
    const mockRequest = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    const mockResponse = jest.fn()
    const mockNext = jest.fn()

    validateJWT(mockRequest, mockResponse, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(mockRequest.user).toEqual(dbUser._id.toString())
  })

  test('given invalid authorization token, returns response with 400 status code', () => {
    const mockRequest = {
      headers: {
        authorization: `Bearer token`
      }
    }
    const mockResponse = {
      status: jest.fn().mockReturnValue({
        json: jest.fn()
      })
    }
    const mockNext = jest.fn()

    validateJWT(mockRequest, mockResponse, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.status().json).toHaveBeenCalled()
    expect(mockResponse.status().json).toHaveBeenCalledWith({
      status: 'fail',
      data: {
        message: 'Invalid token in request header.'
      }
    })
  })

  test('given empty authorization in request header, returns response with 400 status code', () => {
    const mockRequest = {
      headers: {}
    }
    const mockResponse = {
      status: jest.fn().mockReturnValue({
        json: jest.fn()
      })
    }
    const mockNext = jest.fn()

    validateJWT(mockRequest, mockResponse, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.status().json).toHaveBeenCalled()
    expect(mockResponse.status().json).toHaveBeenCalledWith({
      status: 'fail',
      data: {
        message: 'Please add authorization token to request header.'
      }
    })
  })

  test('given Authorization with empty token in request header, returns response with 400 status code', () => {
    const mockRequest = {
      headers: {
        authorization: `Bearer`
      }
    }
    const mockResponse = {
      status: jest.fn().mockReturnValue({
        json: jest.fn()
      })
    }
    const mockNext = jest.fn()

    validateJWT(mockRequest, mockResponse, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.status().json).toHaveBeenCalled()
    expect(mockResponse.status().json).toHaveBeenCalledWith({
      status: 'fail',
      data: {
        message: 'Please add authorization token to request header.'
      }
    })
  })
})