"use client";

import { NotificationPanel } from '@/components/common/notification-panel';
import { useEffect, useState } from 'react';

export default function NotificationDemoPage() {
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    // Lấy user ID từ localStorage hoặc context
    // Đây chỉ là demo, thực tế nên lấy từ auth context
    const userId = localStorage.getItem('userId') || '123e4567-e89b-12d3-a456-426614174000';
    setCurrentUserId(userId);
  }, []);

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Notification Demo</h1>
          <p className="text-gray-600 mt-2">
            Demo SignalR WebSocket + API Endpoints integration
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Current User ID: <code className="bg-gray-100 px-2 py-1 rounded">{currentUserId}</code>
          </p>
        </div>

        <NotificationPanel currentUserId={currentUserId} />
      </div>
    </div>
  );
}
