import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const memos = await db
      .collection('memos')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(memos);
  } catch (error) {
    console.error('GET /api/memos error:', error);
    return NextResponse.json({ error: 'Failed to fetch memos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    
    const now = new Date().toISOString();
    const memo = {
      text: body.text,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await db.collection('memos').insertOne(memo);
    
    return NextResponse.json({ ...memo, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('POST /api/memos error:', error);
    return NextResponse.json({ error: 'Failed to create memo' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const update = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    await db.collection('memos').updateOne(
      { _id: new ObjectId(_id) },
      { $set: update }
    );
    
    return NextResponse.json({ ...update, _id });
  } catch (error) {
    console.error('PUT /api/memos error:', error);
    return NextResponse.json({ error: 'Failed to update memo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await db.collection('memos').deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/memos error:', error);
    return NextResponse.json({ error: 'Failed to delete memo' }, { status: 500 });
  }
}
