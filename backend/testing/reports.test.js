import { beforeAll, describe, jest, test } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import Report from '../models/report.js';

let mongoServer;
let reportSpy;
let operatorToken = jsonwebtoken.sign(
    { email: 'admin@mail.com', role: 'operator' },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 });
let citizenToken = jsonwebtoken.sign(
    { email: 'user@mail.com', role: 'citizen' },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 });

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "testDB" });
    reportSpy = jest.spyOn(Report, 'find').mockImplementation(() => {
        return [{
            _id: 111,
            location: 'Test Location',
            description: 'Test Description'
        }];
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    reportSpy.mockRestore();
});

describe('Report API', () => {

    test('GET /api/reports should return a list of reports', async () => {
        return request(app)
        .get('/api/reports')
        .set('Authorization', `Bearer ${operatorToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            if (res.body && res.body[0]) {
                expect(res.body[0]).toEqual({
                    self: '/api/reports/111',
                    location: 'Test Location',
                    description: 'Test Description'
                });
            };
        });
    });

    let reportId;

    test('POST /api/reports with valid token should create a new report', async () => {
        return request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
            location: 'Test Location',
            description: 'Test Description'
        })
        .expect(201)
        .then(async (res) => {
            const location = res.headers.location;
            reportId = location.split('/').pop();
            expect(location).toBeDefined();
            const checkState = await 
            request(app)
            .get(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${operatorToken}`);
            expect(checkState.body.state).toEqual('pending');

        });
    });

    test('POST /api/reports with incomplete data should return 400', async () => {
        return request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
            description: 'Test Description'
        })
        .expect(400, { message: "Error in report creation" });
    });
    
    test('POST /api/reports with invalid token should return 401', async () => {
        return request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${operatorToken}`)
        .send({
            location: 'Test Location',
            description: 'Test Description'
        })
        .expect(401, { success: false, message: "Access denied" });
    });

    test('PUT /api/reports/:id with valid token should update a report', async () => {
        return request(app)
        .put(`/api/reports/${reportId}`)
        .set('Authorization', `Bearer ${operatorToken}`)
        .send({
            state: 'approved'
        })
        .expect(200)
        .then(async () => {
            const checkState = await 
            request(app)
            .get(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${operatorToken}`);
            expect(checkState.body.state).toEqual('approved');
        });
    });

    test('PUT /api/reports/:id with invalid token should return 401', async () => {
        return request(app)
        .put(`/api/reports/${reportId}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
            state: 'approved'
        })
        .expect(401, { success: false, message: "Access denied" });
    });

    test('DELETE /api/reports/:id with valid token should delete a report', async () => {
        return request(app)
        .delete(`/api/reports/${reportId}`)
        .set('Authorization', `Bearer ${operatorToken}`)
        .expect(204)
        .then(async () => {
            return request(app)
            .get(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${operatorToken}`)
            .expect(404);
        });
    });
});