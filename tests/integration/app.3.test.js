const { server, connection } = require('../../src/app.3')
const User = require('../../src/models/user')
const request = require('supertest')

describe('signup route - 3', () => {
  beforeAll(async () => {
    await User.deleteMany({})
  })

  afterAll(async () => {
    await server.close()
    await connection.close()
  })

  test('given user in request body, return status 201', async () => {
    // Arrange
    const user = {
      firstName: 'First',
      middleName: 'Middle',
      lastName: 'Last',
      email: 'user@test.org',
      password: 'password'
    }

    // Act and Assert
    await request(server)
      .post('/api/v1/auth')
      .send(user)
      .set('Accept', 'application/json')
      .expect(201)
  })

  test('given user in request body, creates user in database', async () => {
    // Arrange
    const user = {
      firstName: 'First',
      middleName: 'Middle',
      lastName: 'Last',
      email: 'user@test.org',
      password: 'password'
    }

    // Act and Assert
    await request(server)
      .post('/api/v1/auth')
      .send(user)
      .set('Accept', 'application/json')

    usersInDB = await User.find({}).lean()
    expect(usersInDB.length).toEqual(1)
    expect(usersInDB[0].email).toEqual('user@test.org')
  })

  test('given an existing user with the same email, returns 400', async () => {
    // Arrange
    const user = {
      firstName: 'First',
      middleName: 'Middle',
      lastName: 'Last',
      email: 'testuser@demo.org',
      password: 'password'
    }
    await new User(user).save()

    // Act and Assert
    await request(server)
      .post('/api/v1/auth')
      .send(user)
      .set('Accept', 'application/json')
      .expect(400, {
        status: 'fail',
        message: 'Email taken.'
      })
  });
})
