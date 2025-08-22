"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNotificationManager } from '@/hooks/use-notification-manager';
import { Bell, Send, Users, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface NotificationPanelProps {
  currentUserId: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  currentUserId 
}) => {
  const [targetUserId, setTargetUserId] = useState('');
  const [message, setMessage] = useState('');
  
  const {
    signalR,
    backendNotifications,
    unreadCount,
    loading,
    sendNotificationToUser,
    sendNotificationToAll,
    markAsRead,
    markAllAsRead,
    fetchUserNotifications,
  } = useNotificationManager({
    userId: currentUserId,
    autoFetchOnMount: true,
  });

  const handleSendToUser = async () => {
    if (!targetUserId.trim() || !message.trim()) {
      toast.error('Vui lòng nhập đầy đủ User ID và message');
      return;
    }

    const success = await sendNotificationToUser(targetUserId.trim(), message.trim());
    if (success) {
      setMessage('');
    }
  };

  const handleSendToAll = async () => {
    if (!message.trim()) {
      toast.error('Vui lòng nhập message');
      return;
    }

    const success = await sendNotificationToAll(message.trim());
    if (success) {
      setMessage('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                signalR.isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm">
                SignalR: {signalR.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Connection ID: {signalR.connectionId || 'N/A'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Send Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Gửi đến User cụ thể
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Target User ID (GUID):
              </label>
              <Input
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                placeholder="123e4567-e89b-12d3-a456-426614174000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message:</label>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hello from notification system!"
              />
            </div>
            <Button 
              onClick={handleSendToUser}
              disabled={!signalR.isConnected || loading}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Send to User (API)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Gửi đến tất cả
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Message:</label>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Announcement for everyone!"
              />
            </div>
            <Button 
              onClick={handleSendToAll}
              disabled={!signalR.isConnected || loading}
              className="w-full"
              variant="outline"
            >
              <Users className="h-4 w-4 mr-2" />
              Send to All (API)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* My Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              My Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} chưa đọc
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchUserNotifications}
                disabled={loading}
              >
                Refresh
              </Button>
              
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={loading}
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading && backendNotifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
            </div>
          ) : backendNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {backendNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.isRead 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                        <p className={`text-sm ${
                          notification.isRead ? 'text-gray-700' : 'font-medium text-gray-900'
                        }`}>
                          {notification.message}
                        </p>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                        title="Mark as read"
                      >
                        <Bell className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
