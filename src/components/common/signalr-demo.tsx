"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSignalR } from '@/contexts/signalr-context';
import { useNotification } from '@/hooks/use-notification';
import { NotificationCenter } from '@/components/common/notification-center';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

export const SignalRDemo: React.FC = () => {
  const { isConnected, sendNotification, joinGroup, leaveGroup } = useSignalR();
  
  // Demo sử dụng hook notification
  useNotification({
    onNotification: (notification) => {
      console.log('Demo received notification:', notification);
    }
  });

  const handleSendTestNotification = async () => {
    try {
      await sendNotification('test-user-id', 'Đây là tin nhắn test từ client!');
      toast.success('Gửi thông báo thành công');
    } catch (error) {
      toast.error('Không thể gửi thông báo');
      console.error(error);
    }
  };

  const handleJoinGroup = async () => {
    try {
      await joinGroup('admin-group');
      toast.success('Đã tham gia nhóm admin-group');
    } catch (error) {
      toast.error('Không thể tham gia nhóm');
      console.error(error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup('admin-group');
      toast.success('Đã rời khỏi nhóm admin-group');
    } catch (error) {
      toast.error('Không thể rời khỏi nhóm');
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">SignalR Demo</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Trạng thái kết nối:</span>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Đã kết nối" : "Mất kết nối"}
            </Badge>
          </div>
          <NotificationCenter />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thao tác cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSendTestNotification}
              disabled={!isConnected}
              className="w-full"
            >
              Gửi thông báo test
            </Button>
            
            <Button 
              onClick={handleJoinGroup}
              disabled={!isConnected}
              variant="outline"
              className="w-full"
            >
              Tham gia nhóm Admin
            </Button>
            
            <Button 
              onClick={handleLeaveGroup}
              disabled={!isConnected}
              variant="outline"
              className="w-full"
            >
              Rời khỏi nhóm Admin
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin kết nối</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>URL Hub:</span>
                <span className="font-mono text-xs">
                  {process.env.NEXT_PUBLIC_SIGNALR_HUB_URL}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Trạng thái:</span>
                <span className={isConnected ? "text-green-600" : "text-red-600"}>
                  {isConnected ? "Kết nối thành công" : "Chưa kết nối"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Auto reconnect:</span>
                <span className="text-green-600">Bật</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn sử dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <h4 className="text-sm font-semibold">1. Sử dụng trong component:</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`import { useSignalR } from '@/contexts/signalr-context';

const MyComponent = () => {
  const { isConnected, sendNotification } = useSignalR();
  
  return (
    <div>
      Status: {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );
};`}
            </pre>

            <h4 className="text-sm font-semibold mt-4">2. Lắng nghe thông báo:</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`import { useNotification } from '@/hooks/use-notification';

const MyComponent = () => {
  useNotification({
    onNotification: (notification) => {
      console.log('Received:', notification);
    }
  });
};`}
            </pre>

            <h4 className="text-sm font-semibold mt-4">3. Hiển thị trung tâm thông báo:</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`import { NotificationCenter } from '@/components/common/notification-center';

const Header = () => (
  <div className="header">
    <NotificationCenter />
  </div>
);`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
