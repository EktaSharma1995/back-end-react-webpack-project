import app from '../src/app';
import request from 'supertest';

const appRequest = request(app);
let token: any;

describe('Post Endpoints', () => {
  it('should have valid email', function(done) {
    appRequest
      .post('/login')
      .send({ email: 'xyz', password: 'Abcd@345' })
      .end(function(err, res) {
        expect(res.status).toBe(422);
        done();
      });
  });

  it('should user exist', function(done) {
    appRequest
      .post('/login')
      .send({ email: 'abcd@gmail.com', password: 'Abcd@345' })
      .end(function(err, res) {
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Email/password not matched');
        done();
      });
  });

  it('should allow user to login', function(done) {
    appRequest
      .post('/login')
      .send({ email: 'navikasharma2019@gmail.com', password: 'Abcd@345' })
      .end(function(err, res) {
        token = res.body.token;
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        done();
      });
  });
});

describe('GET User/', () => {
  // token not being sent - should respond with a 401
  test('It should require authorization', () => {
    return appRequest.get('/user').then(res => {
      expect(res.body.message).toBe('Token is missing');
    });
  });

  // send the token - should respond with a 200
  test('It responds with JSON', () => {
    return appRequest
      .get('/user')
      .set('Authorization', `${token}`)
      .then(res => {
        // const name = res.body[0].name;
        // const email = res.body[0].email;

        // const userInfo = { name: name, email: email };
        expect(res.status).toBe(201);
        console.log(res.body);
        expect(res.type).toBe('application/json');
      });
  });
});
