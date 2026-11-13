'use client';

import { useState, useEffect, useCallback } from 'react';
import { Memo } from '@/types/furniture';

export default function Memos() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMemo, setNewMemo] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchMemos = useCallback(async () => {
    try {
      const res = await fetch('/api/memos');
      const data = await res.json();
      if (Array.isArray(data)) {
        setMemos(data);
      }
    } catch (error) {
      console.error('Failed to fetch memos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemo.trim()) return;
    
    setAdding(true);
    try {
      await fetch('/api/memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMemo.trim() }),
      });
      setNewMemo('');
      fetchMemos();
    } catch (error) {
      console.error('Failed to add memo:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (memo: Memo) => {
    try {
      await fetch('/api/memos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: memo._id, completed: !memo.completed }),
      });
      fetchMemos();
    } catch (error) {
      console.error('Failed to toggle memo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/memos?id=${id}`, { method: 'DELETE' });
      fetchMemos();
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-10 bg-gray-100 rounded mb-3"></div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const activeMemos = memos.filter(m => !m.completed);
  const completedMemos = memos.filter(m => m.completed);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <h3 className="font-semibold text-gray-700">Quick Memos & Ideas</h3>
        {memos.length > 0 && (
          <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {activeMemos.length} active
          </span>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
          placeholder="Add a memo or idea..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
        <button
          type="submit"
          disabled={adding || !newMemo.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </form>

      {memos.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          No memos yet. Add ideas for items you&apos;re considering!
        </p>
      ) : (
        <div className="space-y-4">
          {activeMemos.length > 0 && (
            <div className="space-y-1">
              {activeMemos.map((memo) => (
                <div
                  key={memo._id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group"
                >
                  <button
                    onClick={() => handleToggle(memo)}
                    className="w-5 h-5 rounded border-2 border-gray-300 hover:border-indigo-500 flex items-center justify-center transition-colors"
                  >
                  </button>
                  <span className="flex-1 text-sm text-gray-700">{memo.text}</span>
                  <button
                    onClick={() => handleDelete(memo._id!)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {completedMemos.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Completed ({completedMemos.length})
              </p>
              <div className="space-y-1">
                {completedMemos.map((memo) => (
                  <div
                    key={memo._id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group"
                  >
                    <button
                      onClick={() => handleToggle(memo)}
                      className="w-5 h-5 rounded border-2 border-indigo-500 bg-indigo-500 flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <span className="flex-1 text-sm text-gray-400 line-through">{memo.text}</span>
                    <button
                      onClick={() => handleDelete(memo._id!)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
