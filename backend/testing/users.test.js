import { afterAll, beforeAll, describe, jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import User from '../models/user.js';

let mongoServer;
let userSpy;

let operatorToken = jsonwebtoken.sign(
    { email: 'test_operator@mail.com', role: 'operator' },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 });


beforeAll(async () => {
   mongoServer = await MongoMemoryServer.create();
   await mongoose.connect(mongoServer.getUri(), { dbName: "testDB" });
   userSpy = jest.spyOn(User, 'find').mockImplementation( () => {
        return [{
            _id: 111,
            email: 'test_user@mail.com',
            role: 'citizen'
        }]
   });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    await userSpy.mockRestore();
});

describe('User API', () => {
    
    test('GET /api/users with valid token should return a list of users', async () => {
        return request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${operatorToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            if (res.body && res.body[0]) {
                expect(res.body[0]).toEqual({
                    self: '/api/users/111',
                    email: 'test_user@mail.com',
                    role: 'citizen'
            });
            }
        });
    });

    let userId;
    let userToken;

    test('POST /api/users should create a new user', async () => {
        return request(app)
        .post('/api/users')
        .send({
            email: 'post_test@mail.com',
            password: 'test_password'
        })
        .expect(201).then((res) => {
            expect(res.headers.location).toBeDefined();
            
            const locationHeader = res.headers.location;
            userId = locationHeader.split('/').pop();
            userToken = jsonwebtoken.sign(
                { email: 'post_test@mail.com' },
                process.env.SUPER_SECRET,
                { expiresIn: 86400 });
        });
    });

    test('POST /api/users with registered email should return 400', async () => {
        return request(app)
        .post('/api/users')
        .send({
            email: 'post_test@mail.com',
            password: 'test_password'
        })
        .expect(400, { message: "Error in user creation" });
    });

    // test('POST /api/login with newly created account should return a valid token', async () => {
    //     return request(app)
    //     .post('/api/login')
    //     .send({
    //         email: 'post_test@mail.com',
    //         password: 'test_password'
    //     })
    //     .expect(201).then((res) => {
    //             expect(res.body.token).toBeDefined();
    //             userToken = res.body.token;
    //         });
    // });


    test('GET /api/users/:id with valid token should return user information', async () => {
        return request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${operatorToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            expect(res.body).toEqual({
                self: `/api/users/${userId}`,
                email: 'post_test@mail.com',
                role: 'citizen'
            });
        });
    });

    test('GET /api/users/:id without a token should return 401', async () => {
        return request(app)
        .get(`/api/users/${userId}`)
        .expect(401, { success: false, message: "Token not found" });
    });

    test('DELETE /api/users/:id with valid ID should correctly delete the user', async () => {
        return request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${operatorToken}`)
        .expect(204);
    });


    test('GET /api/users/:id with unregistered account should return 404', async () => {
        return request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${operatorToken}`)
        .expect(404, { message: "User not found" });
    });

    test('POST /api/users with invalid email should return 400', async () => {
        return request(app)
        .post('/api/users')
        .send({
            email: 'invalid_email',
            password: 'test_password'
        })
        .expect(400, { message: "Invalid email" });
    });
        
});