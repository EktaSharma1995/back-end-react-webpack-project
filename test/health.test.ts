import app from '../src/app';
import request from 'supertest';

const appRequest = request(app);

describe('health Endpoints', () => {
  it('check health', async done => {
    const response = await appRequest.get('/health');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
    done();
  });
});
