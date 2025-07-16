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
const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  experience: { type: Number, required: true },
  resumeUrl: { type: String, required: true },
  jobId: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const Applicant = mongoose.models.Applicant || mongoose.model('Applicant', applicantSchema);

// GET handler - Fetch all applicants or filter by jobId
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Build query
    const query = jobId ? { jobId } : {};

    // Fetch applicants with pagination
    const [applicants, total] = await Promise.all([
      Applicant.find(query)
        .select('name age experience resumeUrl jobId submittedAt')
        .skip(skip)
        .limit(limit)
        .lean(),
      Applicant.countDocuments(query),
    ]);

    // Format response
    const response = {
      applicants,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalApplicants: total,
        limit,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applicants: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete an applicant by ID
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const applicantId = searchParams.get('applicantId');

    if (!applicantId) {
      return NextResponse.json(
        { error: 'Applicant ID is required' },
        { status: 400 }
      );
    }

    const result = await Applicant.findByIdAndDelete(applicantId);

    if (!result) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Applicant deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting applicant:', error);
    return NextResponse.json(
      { error: 'Failed to delete applicant: ' + error.message },
      { status: 500 }
    );
  }
}