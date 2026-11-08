'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FurnitureItem } from '@/types/furniture';
import StatsCards from '@/components/StatsCards';
import FilterBar from '@/components/FilterBar';
import FurnitureTable from '@/components/FurnitureTable';
import FurnitureModal from '@/components/FurnitureModal';
import UpcomingDeliveries from '@/components/UpcomingDeliveries';

interface Stats {
  totalSpent: number;
  totalItems: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  spentByCategory: Record<string, number>;
  avgPriority: number;
}

export default function Home() {
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FurnitureItem | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (priorityFilter !== 'all') params.set('priority', priorityFilter);

      const res = await fetch(`/api/furniture?${params}`);
      const data = await res.json();
      if (data.error) {
        console.error('Furniture API error:', data.error);
        setDbError(true);
        setItems([]);
      } else {
        setDbError(false);
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setDbError(true);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter, priorityFilter]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.error) {
        console.error('Stats API error:', data.error);
        setStats(null);
      } else {
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let aVal = a[sortField as keyof FurnitureItem];
      let bVal = b[sortField as keyof FurnitureItem];

      if (aVal === undefined || aVal === null || aVal === '') aVal = '';
      if (bVal === undefined || bVal === null || bVal === '') bVal = '';

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      }
      return bStr.localeCompare(aStr);
    });
  }, [items, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: FurnitureItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (item: Partial<FurnitureItem>) => {
    try {
      if (item._id) {
        await fetch('/api/furniture', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } else {
        await fetch('/api/furniture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      setIsModalOpen(false);
      fetchItems();
      fetchStats();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/furniture?id=${id}`, { method: 'DELETE' });
      fetchItems();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">House Move Tracker</h1>
              <p className="text-sm text-gray-500">Track your furniture and home purchases</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dbError && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium text-amber-800">Database Connection Issue</p>
              <p className="text-sm text-amber-700 mt-1">
                Unable to connect to MongoDB. Please check that your IP is whitelisted in MongoDB Atlas 
                (Network Access → Add IP Address) and that MONGODB_URI is correct.
              </p>
            </div>
          </div>
        )}

        <StatsCards stats={stats} loading={statsLoading} />

        <UpcomingDeliveries items={items} loading={loading} />

        <FilterBar
          category={categoryFilter}
          status={statusFilter}
          priority={priorityFilter}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onAddNew={handleAddNew}
        />

        <FurnitureTable
          items={sortedItems}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <FurnitureModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
