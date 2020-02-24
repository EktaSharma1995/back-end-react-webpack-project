const app = require('../app');
const request = require('supertest');
const appRequest = request(app);

describe('test Endpoints', () => {
  it('gets the test endpoint', async done => {
    const response = await appRequest.get('/test');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('pass!');
    done();
  });
});

describe('Post Endpoints', () => {
  it('should create a new user', function(done) {
    appRequest
      .post('/login')
      .send({ email: 'esharma18@gmail.com', password: 'Abcd345' })
      .expect(201)
      .end(function(err, res) {
        expect(res.body).toHaveProperty('token');
        done();
      });
  });
});
