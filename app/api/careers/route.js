import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Career from '@/app/models/Career';

let cached = global.mongoose || { conn: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB:', mongoose.connection.name);
    cached.conn = conn;
    return conn;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const sort = searchParams.get('sort') || '-createdAt';
    const limit = 10;

    const careers = await Career.find()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Career.countDocuments();

    return NextResponse.json({ careers, total });
  } catch (error) {
    console.error('Error in GET /api/careers:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json({ error: 'Error fetching careers', details: error.message }, { status: 500 });
  }
}