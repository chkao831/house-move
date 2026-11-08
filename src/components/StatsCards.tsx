'use client';

interface Stats {
  totalSpent: number;
  totalItems: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  spentByCategory: Record<string, number>;
  avgPriority: number;
}

interface StatsCardsProps {
  stats: Stats | null;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const delivered = stats.byStatus['Delivered'] || 0;
  const pending = (stats.byStatus['Pending'] || 0) + (stats.byStatus['Ordered'] || 0) + (stats.byStatus['Shipped'] || 0);

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-4 text-white">
          <p className="text-emerald-100 text-sm font-medium">Total Spent</p>
          <p className="text-2xl font-bold">£{stats.totalSpent.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-4 text-white">
          <p className="text-blue-100 text-sm font-medium">Total Items</p>
          <p className="text-2xl font-bold">{stats.totalItems}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-4 text-white">
          <p className="text-purple-100 text-sm font-medium">Delivered</p>
          <p className="text-2xl font-bold">{delivered}</p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg p-4 text-white">
          <p className="text-amber-100 text-sm font-medium">In Progress</p>
          <p className="text-2xl font-bold">{pending}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3">By Status</h3>
          <div className="space-y-2">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{status}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(count / stats.totalItems) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Spending by Category</h3>
          <div className="space-y-2">
            {Object.entries(stats.spentByCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{category}</span>
                <span className="text-sm font-medium text-emerald-600">
                  £{amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
