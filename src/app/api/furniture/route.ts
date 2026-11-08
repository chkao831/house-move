import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    
    const filter: Record<string, unknown> = {};
    
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (priority && priority !== 'all') {
      filter.priority = parseInt(priority);
    }
    
    const items = await db
      .collection('furniture')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('GET /api/furniture error:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    
    const now = new Date().toISOString();
    const item = {
      ...body,
      price: parseFloat(body.price) || 0,
      priority: parseInt(body.priority) || 3,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await db.collection('furniture').insertOne(item);
    
    return NextResponse.json({ ...item, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('POST /api/furniture error:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
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
    
    const item = {
      ...updateData,
      price: parseFloat(updateData.price) || 0,
      priority: parseInt(updateData.priority) || 3,
      updatedAt: new Date().toISOString(),
    };
    
    await db.collection('furniture').updateOne(
      { _id: new ObjectId(_id) },
      { $set: item }
    );
    
    return NextResponse.json({ ...item, _id });
  } catch (error) {
    console.error('PUT /api/furniture error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
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
    
    await db.collection('furniture').deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/furniture error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
