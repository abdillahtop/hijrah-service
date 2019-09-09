const App = require('../app')
const should = require('should')
// const expect = require('chai').expect
const supertest = require('supertest')

const server = supertest(App.server)

const admin = {
  email: 'admin@admin.com',
  password: 'adminadmin'
}

let userToken, userId

const user = {
  email: 'user@user.com',
  password: 'useruser'
}

describe('User Authentication', () => {

  it('User can login to get Token', (done) => {
    server
      .post('/user/login')
      .expect('Content-Type', /json/)
      .set('Authorization', 'X-CONTROL-APP')
      .send({ ...admin })
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        userToken = 'Bearer ' + res.body.result.token
        userId = res.body.result.userid
        done()
      })
  })
})

describe('User can get data', () => {
  it('User get all data', (done) => {
    server
      .get('/user')
      .expect('Content-Type', /json/)
      .set('Authorization', 'X-CONTROL-APP')
      .set('x-control-user', userId)
      .set('x-access-token', userToken)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.should.have.property('result').which.is.a.Array()
        done()
      })
  })
})
