'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Stats {
  totalSpent: number;
  totalWithWishlist: number;
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

const STATUS_COLORS: Record<string, string> = {
  Wishlist: '#9CA3AF',
  Pending: '#FBBF24',
  Ordered: '#3B82F6',
  Shipped: '#6366F1',
  Delivered: '#10B981',
  Purchased: '#8B5CF6',
  Returned: '#EF4444',
  Cancelled: '#6B7280',
};

const CATEGORY_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="space-y-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6 h-64 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-48 bg-gray-100 rounded"></div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 h-64 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-48 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || !stats.byStatus) return null;

  const delivered = stats.byStatus['Delivered'] || 0;
  const pending = (stats.byStatus['Pending'] || 0) + (stats.byStatus['Ordered'] || 0) + (stats.byStatus['Shipped'] || 0);

  const statusData = Object.entries(stats.byStatus).map(([name, value]) => ({
    name,
    value,
    color: STATUS_COLORS[name] || '#9CA3AF',
  }));

  const categoryData = Object.entries(stats.spentByCategory)
    .map(([name, value], index) => ({
      name: name.length > 12 ? name.substring(0, 12) + '...' : name,
      fullName: name,
      spent: value,
      fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }))
    .sort((a, b) => b.spent - a.spent);

  const itemsByCategoryData = Object.entries(stats.byCategory)
    .map(([name, value], index) => ({
      name: name.length > 12 ? name.substring(0, 12) + '...' : name,
      fullName: name,
      items: value,
      fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }))
    .sort((a, b) => b.items - a.items);

  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-4 text-white">
          <p className="text-emerald-100 text-sm font-medium">Total Spent</p>
          <p className="text-2xl font-bold">£{stats.totalSpent.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
        </div>
        
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg p-4 text-white">
          <p className="text-teal-100 text-sm font-medium">Incl. Wishlist</p>
          <p className="text-2xl font-bold">£{stats.totalWithWishlist.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3 text-center">Items by Status</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3 text-center">Spending by Category</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tickFormatter={(value) => `£${value}`} fontSize={11} />
                <YAxis type="category" dataKey="name" width={80} fontSize={11} />
                <Tooltip 
                  formatter={(value) => [`£${Number(value).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`, 'Spent']}
                  labelFormatter={(label) => categoryData.find(d => d.name === label)?.fullName || label}
                />
                <Bar dataKey="spent" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3 text-center">Items by Category</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={itemsByCategoryData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" fontSize={11} />
                <YAxis type="category" dataKey="name" width={80} fontSize={11} />
                <Tooltip 
                  formatter={(value) => [`${value} items`, 'Count']}
                  labelFormatter={(label) => itemsByCategoryData.find(d => d.name === label)?.fullName || label}
                />
                <Bar dataKey="items" radius={[0, 4, 4, 0]}>
                  {itemsByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
