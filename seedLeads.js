const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lead = require('./app/models/Lead');

dotenv.config();

const seedData = [
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    industry: 'Technology',
    message: 'Interested in cloud services.',
    submittedAt: new Date('2025-07-16T07:47:05.751Z'),
  },
  {
    firstName: 'Sarah',
    lastName: 'Davis',
    email: 'sarah.davis@example.com',
    industry: 'Healthcare',
    message: 'Need patient management software.',
    submittedAt: new Date('2025-07-15T08:30:00.000Z'),
  },
  {
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'robert.wilson@example.com',
    industry: 'Education',
    message: 'Looking for e-learning platforms.',
    submittedAt: new Date('2025-07-14T09:15:00.000Z'),
  },
];

async function seed() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Lead.deleteMany({});
    console.log('Cleared existing leads');

    await Lead.insertMany(seedData);
    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();