const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Career = require('./app/models/Career');

dotenv.config();

const seedData = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    resume: "https://example.com/resume/john",
    appliedPosition: "Frontend Developer",
    status: "pending",
    createdAt: new Date("2025-07-16T07:47:05.751Z")
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543210",
    resume: "https://example.com/resume/jane",
    appliedPosition: "Backend Developer",
    status: "interviewed",
    createdAt: new Date("2025-07-15T08:30:00.000Z")
  }
];

async function seed() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Career.deleteMany({});
    console.log('Cleared existing careers');

    await Career.insertMany(seedData);
    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
