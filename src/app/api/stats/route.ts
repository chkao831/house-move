import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const items = await db.collection('furniture').find({}).toArray();
    
    const totalSpent = items
      .filter(item => ['Purchased', 'Delivered', 'Ordered', 'Shipped'].includes(item.status))
      .reduce((sum, item) => sum + (item.price || 0), 0);
    
    const totalItems = items.length;
    
    const byStatus: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const spentByCategory: Record<string, number> = {};
    
    items.forEach(item => {
      byStatus[item.status] = (byStatus[item.status] || 0) + 1;
      byCategory[item.category] = (byCategory[item.category] || 0) + 1;
      
      if (['Purchased', 'Delivered', 'Ordered', 'Shipped'].includes(item.status)) {
        spentByCategory[item.category] = (spentByCategory[item.category] || 0) + (item.price || 0);
      }
    });
    
    const avgPriority = items.length > 0
      ? items.reduce((sum, item) => sum + (item.priority || 3), 0) / items.length
      : 0;
    
    return NextResponse.json({
      totalSpent,
      totalItems,
      byStatus,
      byCategory,
      spentByCategory,
      avgPriority: Math.round(avgPriority * 10) / 10,
    });
  } catch (error) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
