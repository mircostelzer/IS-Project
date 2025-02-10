import request from 'supertest';
import app from '../app';

test('app module should be defined', () => {
    expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
    return request(app)
        .get('/')
        .expect(200);
});