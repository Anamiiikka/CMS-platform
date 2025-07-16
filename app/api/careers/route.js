import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Career from '@/app/models/Career';

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const careers = await Career.find();
    return NextResponse.json(careers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json({ error: 'Error fetching careers' }, { status: 500 });
  } finally {
    await mongoose.connection.close();
  }
}