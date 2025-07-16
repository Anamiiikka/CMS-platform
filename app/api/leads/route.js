import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// MongoDB connection
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'adalabs',
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Database connection failed');
  }
}

// MongoDB Schema
const leadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  industry: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

// POST handler
export async function POST(request) {
  try {
    await connectToDatabase();

    const { firstName, lastName, email, industry, message } = await request.json();

    if (!firstName || !lastName || !email || !industry || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const lead = new Lead({ firstName, lastName, email, industry, message });
    await lead.save();
    console.log('Lead saved:', lead);

    return NextResponse.json(
      { message: 'Lead submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Failed to process lead: ' + error.message },
      { status: 500 }
    );
  }
}

// GET handler
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sort = searchParams.get('sort') || '-submittedAt'; // Default to descending order
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find()
        .select('firstName lastName email industry message submittedAt')
        .sort(sort) // Apply sorting based on the 'sort' parameter
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(),
    ]);

    const response = {
      leads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLeads: total,
        limit,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads: ' + error.message },
      { status: 500 }
    );
  }
}