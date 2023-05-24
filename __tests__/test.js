// const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Assuming this is your Express app instance
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Message = require('../models/message');
const User = require('../models/User');

dotenv.config();

chai.use(chaiHttp);
chai.should();

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const testURI = 'mongodb://localhost:27017/message';
const prodURI = 'mongodb://mongoService:27017/message';
const JWT_SECRET = 'newtonSchool';

const request = chai.request;

describe('POST /messages', () => {
  before(async () => {
    await mongoose.connect(testURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteMany({});
    await Message.deleteMany({});
    console.log('Connected to DB');
  });

  after(async () => {
    // await Message.deleteMany({});
    await mongoose.connection.db.dropDatabase();
    console.log('Disconnected from DB');
  });

  it('should send a new message', async () => {
    const testContent = {
      content: 'Hello, this is a test message',
    };
    const payload = {
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'password1',
      _id: '643d2af79287922f1c47c65c',
    };

    const payload2 = {
      username: 'jahndoe',
      email: 'jahndoe@example.com',
      password: 'password1123',
      _id: '643d2af79287922f1c47c78b',
    };

    // Register the first user
    await request(app).post('/api/v1/auth/signup').send(payload);
    await request(app).post('/api/v1/auth/signup').send(payload2);

    const token = jwt.sign(payload, JWT_SECRET);
    console.log(token);

    const response = await request(app)
      .post('/api/v1/users/newmessage')
      .set('Authorization', `Bearer ${token}`)
      .send(testContent);

    expect(response.status).to.equal(404);
  });
});
describe('GET /messages', () => {
  before(async () => {
    await mongoose.connect(testURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Message.deleteMany({});
    console.log('Connected to DB');
  });

  after(async () => {
    // await Message.deleteMany({});
    await mongoose.connection.db.dropDatabase();
    console.log('Disconnected from DB');
  });
  const testContent = {
    content: 'Hello, this is a test message',
  };
  it('should update a message', async () => {
    const messageId = testContent; // Replace with a valid message ID
    const response = await request(app)
      .put(`api/v1/users/updatemessage/message/id`)
      .send({
        content: 'Updated message content',
      });

    expect(response.status).toBe(404);
  });
});
//   describe('GET /messages', () => {
//     it('should get all messages', async () => {
//       const response = await request(app)
//         .get('/messages')
//         .set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('messages');
//     });

//     // Add more test cases for different scenarios
//   });

//   describe('DELETE /messages/:id', () => {
//     it('should delete a message', async () => {
//       const messageId = 'MESSAGE_ID'; // Replace with a valid message ID
//       const response = await request(app)
//         .delete(`/messages/${messageId}`)
//         .set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('message', 'Message deleted successfully');
//     });

//     // Add more test cases for different scenarios
//   });
