const { server, connection } = require('../src/app.2')
const User = require('../src/models/user')
const request = require('supertest')
const bcrypt = require('bcrypt')


describe('login route', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  afterAll(async () => {
    await connection.close()
    await server.close()
  })

  test('given valid login credentials json, returns 200', async () => {
    // Arrange
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('password', salt)
    const user = {
      firstName: 'First',
      middleName: 'Middle',
      lastName: 'Last',
      email: 'testuser@demo.org',
      password: hashedPassword
    }
    await new User(user).save()

    // Act and Assert
    await request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'testuser@demo.org',
        password: 'password'
      })
      .set('Accept', 'application/json')
      .expect(200)
  })

  test('given incorrect login credentials json, returns 400', async () => {
    // Arrange
    const email = 'user@test.org'
    const password = 'password'
    const user = { email, password }

    // Act and Assert
    await request(server)
      .post('/api/v1/auth/login')
      .send(user)
      .set('Accept', 'application/json')
      .expect(400, {
        status: 'fail',
        message: 'Incorrect login credentials'
      })
  })
})
