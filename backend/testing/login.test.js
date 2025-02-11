import { beforeAll, describe, jest, test } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/user.js';

let mongoServer;
let newUser;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "testDB" });
    newUser = await User.create({
        email: 'test@mail.com',
        password: 'test_password'
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('Login API', () => {

    test('POST /api/login with newly created account should return a valid token', async () => {
        return request(app)
        .post('/api/login')
        .send({
            email: newUser.email,
            password: newUser.password
        })
        .expect(201).then((res) => {
                expect(res.body.token).toBeDefined();
            });
    });

    test('POST /api/login with unregistered email should return 404', async () => {
        return request(app)
        .post('/api/login')
        .send({
            email: 'fake@mail.com',
            password: 'fake_password'
        })
        .expect(404, { success: false, message: "Authentication failed: user not found" });
    });

    test('POST /api/login with invalid password should return 401', async () => {
        return request(app)
        .post('/api/login')
        .send({
            email: newUser.email,
            password: 'invalid_password'
        })
        .expect(401, { success: false, message: "Authentication failed: incorrect password" });
    });


});