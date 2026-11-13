'use client';

import { FurnitureItem } from '@/types/furniture';

interface UpcomingDeliveriesProps {
  items: FurnitureItem[];
  loading: boolean;
}

export default function UpcomingDeliveries({ items, loading }: UpcomingDeliveriesProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg shadow p-4 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingDeliveries = items
    .filter(item => {
      if (!item.deliveryDate) return false;
      if (['Delivered', 'Cancelled', 'Returned'].includes(item.status)) return false;
      const deliveryDate = new Date(item.deliveryDate);
      deliveryDate.setHours(0, 0, 0, 0);
      return deliveryDate >= today;
    })
    .sort((a, b) => new Date(a.deliveryDate!).getTime() - new Date(b.deliveryDate!).getTime());

  const statusPriority: Record<string, number> = { 'Shipped': 1, 'Ordered': 2, 'Purchased': 3 };
  
  const awaitingDeliveryDate = items
    .filter(item => {
      if (item.deliveryDate) return false;
      return ['Purchased', 'Shipped', 'Ordered'].includes(item.status);
    })
    .sort((a, b) => {
      const priorityDiff = (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.orderDate || b.createdAt).getTime() - new Date(a.orderDate || a.createdAt).getTime();
    });

  const formatDate = (dateStr: string, timeStr?: string) => {
    const date = new Date(dateStr);
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let formatted = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    
    if (timeStr) {
      formatted += ` at ${timeStr}`;
    }
    
    if (diffDays === 0) return { text: 'Today', badge: 'bg-red-100 text-red-700', formatted };
    if (diffDays === 1) return { text: 'Tomorrow', badge: 'bg-orange-100 text-orange-700', formatted };
    if (diffDays <= 7) return { text: `${diffDays} days`, badge: 'bg-yellow-100 text-yellow-700', formatted };
    return { text: `${diffDays} days`, badge: 'bg-blue-100 text-blue-700', formatted };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="font-semibold text-gray-700">Upcoming Deliveries</h3>
          {upcomingDeliveries.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {upcomingDeliveries.length}
            </span>
          )}
        </div>
        
        {upcomingDeliveries.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming deliveries scheduled</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {upcomingDeliveries.map((item) => {
              const dateInfo = formatDate(item.deliveryDate!, item.deliveryTime);
              return (
                <div 
                  key={item._id} 
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.store} • {item.category}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{dateInfo.formatted}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${dateInfo.badge}`}>
                        {dateInfo.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-semibold text-gray-700">Awaiting Delivery Date</h3>
          {awaitingDeliveryDate.length > 0 && (
            <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {awaitingDeliveryDate.length}
            </span>
          )}
        </div>
        
        {awaitingDeliveryDate.length === 0 ? (
          <p className="text-gray-500 text-sm">All purchased items have delivery dates</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {awaitingDeliveryDate.map((item) => (
              <div 
                key={item._id} 
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.store} • {item.category}</p>
                </div>
                <div className="ml-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700' : 
                    item.status === 'Ordered' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
