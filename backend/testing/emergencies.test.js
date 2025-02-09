import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import Emergency from "../models/emergency.js";

let mongoServer;
let emergencySpy;
let emergencySpyFindByID;

let token = jsonwebtoken.sign(
    { email: 'test@mail.com', role: 'operator' },
    process.env.SUPER_SECRET,
    { expiresIn: 86400 })

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "testDB" });
    emergencySpy = jest.spyOn(Emergency, 'find').mockImplementation((criteria) => {
        return [
            {
                _id: 111,
                title: 'Test Emergency',
                category: 'Test Category',
                startDate: '2021-09-01',
                description: 'Test Description',
                location: 'Test Location'
            }];
        });
    emergencySpyFindByID = jest.spyOn(Emergency, 'findById').mockImplementation((id) => {
        if (id === 111) {
            return {
                _id: 111,
                title: 'Test Emergency',
                category: 'Test Category',
                startDate: '2021-09-01',
                description: 'Test Description',
                location: 'Test Location'
            };
        } else {
            return null;
        }
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    emergencySpy.mockRestore();
    emergencySpyFindByID.mockRestore();
});

describe('GET /api/emergencies', () => {
    test('GET /api/emergencies should return a list of emergencies', async () => {
        return request(app)
        .get('/api/emergencies')
        .expect('Content-Type', /json/).then((response) => {
            if (response.body && response.body[0]) {
                expect(response.body[0]).toEqual({
                    self: '/api/emergencies/111',
                    title: 'Test Emergency',
                    category: 'Test Category',
                    startDate: '2021-09-01',
                    description: 'Test Description',
                    location: 'Test Location'
                });
            };
        });
    });

    test('POST /api/emergencies correctly creates an emergency', async () => {
        return request(app)
        .post('/api/emergencies')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Test Emergency 2',
            category: 'Test Category',
            startDate: '2021-09-01',
            description: 'Test Description',
            location: 'Test Location'
        })
        .expect(201);
    });

    test('DELETE /api/emergencies/:id correctly deletes an emergency', async () => {
        const emergency = await Emergency.create({
            title: 'Test Emergency 3',
            category: 'Test Category',
            startDate: '2021-09-01',
            description: 'Test Description',
            location: 'Test Location'
        });
        return request(app)
        .delete('/api/emergencies/' + emergency._id)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    test('POST /api/emergencies with incomplete data should return 400', async () => {
        return request(app)
        .post('/api/emergencies')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Test Emergency 2',
            category: 'Test Category'
        })
        .expect(400);
    });
})