import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Lead from '@/app/models/Lead';

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const leads = await Lead.find();
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Error fetching leads' }, { status: 500 });
  } finally {
    await mongoose.connection.close();
  }
}