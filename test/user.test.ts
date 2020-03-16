import app from '../src/app';
import request from 'supertest';

const appRequest = request(app);

describe('Post Endpoints', () => {
  it('should create a new user', function(done) {
    appRequest
      .post('/login')
      .send({ email: 'esharma18@gmail.com', password: 'Abcd@345' })
      .expect(201)
      .end(function(err, res) {
        expect(res.body).toHaveProperty('token');
        done();
      });
  });
});
