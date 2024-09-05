const request = require('supertest');
const app = require('../app'); // Adjust the path to your Express app
const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');

describe('Event Management API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await Event.deleteMany({});
    await Registration.deleteMany({});
  });

  test('POST /events should create a new event', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({
        name: 'Tech Conference 2024',
        description: 'An event to showcase the latest in technology.',
        date: '2024-12-15',
        location: 'San Francisco, CA',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Event created successfully');
    expect(res.body.event).toHaveProperty('name', 'Tech Conference 2024');
  });

  test('GET /events should retrieve a list of events', async () => {
    await new Event({
      name: 'Tech Conference 2024',
      description: 'An event to showcase the latest in technology.',
      date: '2024-12-15',
      location: 'San Francisco, CA',
    }).save();

    const res = await request(app).get('/api/events');

    expect(res.statusCode).toBe(200);
    expect(res.body.events.length).toBeGreaterThan(0);
  });

  test('GET /events/:id should retrieve an event by ID', async () => {
    const event = await new Event({
      name: 'Tech Conference 2024',
      description: 'An event to showcase the latest in technology.',
      date: '2024-12-15',
      location: 'San Francisco, CA',
    }).save();

    const res = await request(app).get(`/api/events/${event._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Tech Conference 2024');
  });

  test('PUT /events/:id should update an event by ID', async () => {
    const event = await new Event({
      name: 'Tech Conference 2024',
      description: 'An event to showcase the latest in technology.',
      date: '2024-12-15',
      location: 'San Francisco, CA',
    }).save();

    const res = await request(app)
      .put(`/api/events/${event._id}`)
      .send({
        name: 'Updated Tech Conference 2024',
        description: 'Updated description.',
        date: '2024-12-16',
        location: 'Los Angeles, CA',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.event).toHaveProperty('name', 'Updated Tech Conference 2024');
  });

  test('DELETE /events/:id should delete an event by ID', async () => {
    const event = await new Event({
      name: 'Tech Conference 2024',
      description: 'An event to showcase the latest in technology.',
      date: '2024-12-15',
      location: 'San Francisco, CA',
    }).save();

    const res = await request(app).delete(`/api/events/${event._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Event deleted successfully');
  });

  test('POST /events/:id/register should register a user for an event', async () => {
    const event = await new Event({
      name: 'Tech Conference 2024',
      description: 'An event to showcase the latest in technology.',
      date: '2024-12-15',
      location: 'San Francisco, CA',
    }).save();

    const res = await request(app)
      .post(`/api/events/${event._id}/register`)
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Registration successful, confirmation email sent.');
    expect(res.body.registration).toHaveProperty('name', 'John Doe');
  });
});
