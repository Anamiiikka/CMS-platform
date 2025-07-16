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

export async function GET() {
  try {
    await dbConnect();
    const careers = await Career.find();
    console.log('Query result:', careers);
    return NextResponse.json(careers);
  } catch (error) {
    console.error('Error in GET /api/careers:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json({ error: 'Error fetching careers', details: error.message }, { status: 500 });
  }
}
