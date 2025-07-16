import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Lead from '@/app/models/Lead';

let cached = global.mongoose || { conn: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
    const sort = searchParams.get('sort') || '-submittedAt';
    const limit = 10;

    const leads = await Lead.find()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Lead.countDocuments();

    return NextResponse.json({ leads, total }, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust for production
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/leads:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json({ error: 'Error fetching leads', details: error.message }, { status: 500 });
  }
}