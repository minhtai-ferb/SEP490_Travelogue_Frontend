"use client";

import { useState, useEffect } from 'react';
import { useSignalR } from '@/contexts/signalr-context';
import { useNotification } from '@/hooks/use-notification';
import { notificationApiService, BackendNotification } from '@/services/notification-api-service';
import { NotificationData } from '@/services/signalr-service';
import toast from 'react-hot-toast';

interface UseNotificationManagerOptions {
  userId?: string;
  autoFetchOnMount?: boolean;
}

export const useNotificationManager = (options: UseNotificationManagerOptions = {}) => {
  const { userId, autoFetchOnMount = true } = options;
  const [backendNotifications, setBackendNotifications] = useState<BackendNotification[]>([]);
  const [realtimeNotifications, setRealtimeNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const signalR = useSignalR();

  // Lắng nghe thông báo real-time
  useNotification({
    onNotification: (notification) => {
      console.log('📨 Real-time notification received:', notification);
      
      // Thêm vào danh sách real-time
      setRealtimeNotifications(prev => [notification, ...prev.slice(0, 49)]);
      
      // Tăng số lượng chưa đọc
      setUnreadCount(prev => prev + 1);
      
      // Nếu có userId, refresh danh sách từ backend
      if (userId) {
        fetchUserNotifications();
      }
    },
    filterByUserId: userId,
  });

  // Lấy danh sách thông báo từ backend
  const fetchUserNotifications = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const notifications = await notificationApiService.getUserNotifications(userId);
      setBackendNotifications(notifications);
      
      // Đếm số thông báo chưa đọc
      const unread = notifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Không thể tải danh sách thông báo');
    } finally {
      setLoading(false);
    }
  };

  // Gửi thông báo đến user cụ thể qua API
  const sendNotificationToUser = async (targetUserId: string, message: string) => {
    try {
      await notificationApiService.sendNotificationToUser(targetUserId, message);
      toast.success('Gửi thông báo thành công');
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error('Không thể gửi thông báo');
      return false;
    }
  };

  // Gửi thông báo đến tất cả qua API
  const sendNotificationToAll = async (message: string) => {
    try {
      await notificationApiService.sendNotificationToAll(message);
      toast.success('Gửi thông báo đến tất cả thành công');
      return true;
    } catch (error) {
      console.error('Failed to send notification to all:', error);
      toast.error('Không thể gửi thông báo');
      return false;
    }
  };

  // Đánh dấu thông báo đã đọc
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationApiService.markNotificationAsRead(notificationId);
      
      // Cập nhật state local
      setBackendNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, isRead: true }
            : n
        )
      );
      
      // Giảm số lượng chưa đọc
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Không thể đánh dấu đã đọc');
      return false;
    }
  };

  // Đánh dấu tất cả đã đọc
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = backendNotifications.filter(n => !n.isRead);
      
      await Promise.all(
        unreadNotifications.map(n => notificationApiService.markNotificationAsRead(n.id))
      );
      
      // Cập nhật state local
      setBackendNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      setUnreadCount(0);
      toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
      return true;
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Không thể đánh dấu tất cả đã đọc');
      return false;
    }
  };

  // Auto fetch khi component mount
  useEffect(() => {
    if (autoFetchOnMount && userId) {
      fetchUserNotifications();
    }
  }, [userId, autoFetchOnMount]);

  return {
    // SignalR connection info
    signalR: {
      isConnected: signalR.isConnected,
      connectionId: signalR.connectionId,
      connectionInfo: signalR.connectionInfo,
    },
    
    // Notifications data
    backendNotifications,
    realtimeNotifications,
    unreadCount,
    loading,
    
    // Actions
    fetchUserNotifications,
    sendNotificationToUser,
    sendNotificationToAll,
    markAsRead,
    markAllAsRead,
    
    // SignalR direct methods (for testing)
    signalRMethods: {
      sendToUser: signalR.sendToUser,
      sendToAll: signalR.sendToAll,
      sendToGroup: signalR.sendToGroup,
    }
  };
};
