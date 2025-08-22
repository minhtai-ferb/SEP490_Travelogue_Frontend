"use client";

import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { signalRService, NotificationData } from '@/services/signalr-service';
import { useRouter } from 'next/navigation';

interface SignalRContextType {
  isConnected: boolean;
  connectionId?: string;
  connectionInfo: {
    state: any;
    connectionId?: string;
    isConnected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  };
  sendNotification: (userId: string, message: string) => Promise<void>;
  sendToUser: (userId: string, message: string) => Promise<void>;
  sendToAll: (message: string) => Promise<void>;
  sendToGroup: (groupName: string, message: string) => Promise<void>;
  joinGroup: (groupName: string) => Promise<void>;
  leaveGroup: (groupName: string) => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType | null>(null);

interface SignalRProviderProps {
  children: ReactNode;
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({ children }) => {
  const router = useRouter();
  const connectionAttempted = useRef(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [connectionId, setConnectionId] = React.useState<string>();

  useEffect(() => {
    // Kiểm tra xem có token không trước khi kết nối
    const token = localStorage.getItem("jwtToken");
    if (!token || connectionAttempted.current) {
      return;
    }

    let mounted = true;
    connectionAttempted.current = true;

    const initConnection = async () => {
      try {
        await signalRService.startConnection();
        if (mounted) {
          setIsConnected(true);
          setConnectionId(signalRService.getConnectionId());
        }
      } catch (error) {
        console.error("Failed to initialize SignalR connection:", error);
        if (mounted) {
          setIsConnected(false);
        }
      }
    };

    // Đăng ký callback để nhận thông báo
    const unsubscribeNotification = signalRService.onNotification((notification: NotificationData) => {
      handleNotification(notification);
    });

    // Đăng ký callback khi kết nối thành công
    const unsubscribeConnection = signalRService.onConnected(() => {
      console.log("🎉 SignalR connected successfully!");
      if (mounted) {
        setIsConnected(true);
        setConnectionId(signalRService.getConnectionId());
      }
    });

    // Đăng ký callback khi mất kết nối  
    const unsubscribeDisconnection = signalRService.onDisconnected((error) => {
      console.log("💔 SignalR disconnected:", error);
      if (mounted) {
        setIsConnected(false);
        setConnectionId(undefined);
      }
    });

    initConnection();

    // Cleanup function
    return () => {
      mounted = false;
      unsubscribeNotification();
      unsubscribeConnection();
      unsubscribeDisconnection();
      signalRService.stopConnection();
      connectionAttempted.current = false;
    };
  }, []);

  const handleNotification = (notification: NotificationData) => {
    console.log("Received notification in context:", notification);
    
    // Xử lý các loại thông báo khác nhau
    switch (notification.type) {
      case 'info':
        // Có thể điều hướng đến trang thông báo hoặc cập nhật state
        break;
      case 'success':
        // Xử lý thông báo thành công
        break;
      case 'warning':
        // Xử lý cảnh báo
        break;
      case 'error':
        // Xử lý lỗi
        break;
      default:
        break;
    }
  };

  const contextValue: SignalRContextType = {
    isConnected,
    connectionId,
    connectionInfo: signalRService.getConnectionInfo(),
    sendNotification: signalRService.sendNotification.bind(signalRService),
    sendToUser: signalRService.sendToUser.bind(signalRService),
    sendToAll: signalRService.sendToAll.bind(signalRService),
    sendToGroup: signalRService.sendToGroup.bind(signalRService),
    joinGroup: signalRService.joinGroup.bind(signalRService),
    leaveGroup: signalRService.leaveGroup.bind(signalRService),
  };

  return (
    <SignalRContext.Provider value={contextValue}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = (): SignalRContextType => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
};
