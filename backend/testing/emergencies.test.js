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
    emergencySpy = jest.spyOn(Emergency, 'find').mockImplementation(() => {
        return [{
                _id: 111,
                title: 'Test Emergency',
                category: 'Test Category',
                startDate: '2021-09-01',
                description: 'Test Description',
                location: 'Test Location'
            }];
        });
    // emergencySpyFindByID = jest.spyOn(Emergency, 'findById').mockImplementation((id) => {
    //     if (id === 111) {
    //         return {
    //             _id: 111,
    //             title: 'Test Emergency',
    //             category: 'Test Category',
    //             startDate: '2021-09-01',
    //             description: 'Test Description',
    //             location: 'Test Location'
    //         };
    //     } else {
    //         return null;
    //     }
    // });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    emergencySpy.mockRestore();
    // emergencySpyFindByID.mockRestore();
});

describe('Emergency API', () => {

    test('GET /api/emergencies should return a list of emergencies', async () => {
        return request(app)
        .get('/api/emergencies')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            if (res.body && res.body[0]) {
                expect(res.body[0]).toEqual({
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

    let emergencyId;
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
        .expect(201).then( (res) => {
            expect(res.headers.location).toBeDefined();

            const locationHeader = res.headers.location;
            emergencyId = locationHeader.split('/').pop();
        });
    });
    
    test('DELETE /api/emergencies/:id correctly deletes an emergency', async () => {
        return request(app)
        .delete(`/api/emergencies/${emergencyId}`) // using the emergencyId from the previous test
        .set('Authorization', `Bearer ${token}`) 
        .expect(204).then( () => {
            return request(app)
            .get(`/api/emergencies/${emergencyId}`)
            .expect(404);
        });
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