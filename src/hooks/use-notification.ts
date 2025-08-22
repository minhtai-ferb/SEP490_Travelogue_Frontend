"use client";

import { useEffect, useRef } from 'react';
import { signalRService, NotificationData } from '@/services/signalr-service';

interface UseNotificationOptions {
  onNotification?: (notification: NotificationData) => void;
  filterByUserId?: string;
  filterByType?: NotificationData['type'][];
}

export const useNotification = (options: UseNotificationOptions = {}) => {
  const { onNotification, filterByUserId, filterByType } = options;
  const callbackRef = useRef(onNotification);

  // Cập nhật callback ref khi onNotification thay đổi
  useEffect(() => {
    callbackRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    if (!callbackRef.current) return;

    const handleNotification = (notification: NotificationData) => {
      // Lọc theo userId nếu có
      if (filterByUserId && notification.userId !== filterByUserId) {
        return;
      }

      // Lọc theo type nếu có
      if (filterByType && !filterByType.includes(notification.type)) {
        return;
      }

      callbackRef.current?.(notification);
    };

    // Đăng ký callback
    const unsubscribe = signalRService.onNotification(handleNotification);

    return unsubscribe;
  }, [filterByUserId, filterByType]);

  return {
    isConnected: signalRService.isConnected(),
    sendNotification: signalRService.sendNotification.bind(signalRService),
    joinGroup: signalRService.joinGroup.bind(signalRService),
    leaveGroup: signalRService.leaveGroup.bind(signalRService),
  };
};
