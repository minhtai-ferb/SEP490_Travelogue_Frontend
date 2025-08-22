"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSignalR } from '@/contexts/signalr-context';
import { useNotification } from '@/hooks/use-notification';
import { useNotificationManager } from '@/hooks/use-notification-manager';
import { Badge } from '@/components/ui/badge';
import { NotificationList } from '@/components/common/notification-list';
import toast from 'react-hot-toast';
import { signalRService } from '@/services/signalr-service';
import { notificationApiService } from '@/services/notification-api-service';

export const SignalRConnectionTest: React.FC = () => {
  const { 
    isConnected, 
    connectionId, 
    connectionInfo,
    sendToUser, 
    sendToAll, 
    sendToGroup 
  } = useSignalR();
  
  const [testUserId, setTestUserId] = useState('123e4567-e89b-12d3-a456-426614174000'); // GUID format
  const [testMessage, setTestMessage] = useState('Hello from client!');
  const [testGroup, setTestGroup] = useState('admin-group');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  const notificationManager = useNotificationManager({
    userId: testUserId,
    autoFetchOnMount: true,
  });

  // Lắng nghe thông báo và lưu vào state để hiển thị
  useNotification({
    onNotification: (notification) => {
      console.log('🔔 Test component received notification:', notification);
      setNotifications(prev => [
        `${new Date().toLocaleTimeString()}: ${notification.message}`,
        ...prev.slice(0, 9) // Giữ tối đa 10 notifications
      ]);
    }
  });

  // Test API connection khi component mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const result = await notificationApiService.testApiConnection();
        setApiConnected(result);
      } catch (error) {
        setApiConnected(false);
      }
    };

    testApiConnection();
  }, []);

  const handleSendToUser = async () => {
    try {
      // Gửi qua API thay vì SignalR trực tiếp
      await notificationManager.sendNotificationToUser(testUserId, testMessage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendToAll = async () => {
    try {
      // Gửi qua API thay vì SignalR trực tiếp  
      await notificationManager.sendNotificationToAll(testMessage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendToGroup = async () => {
    try {
      // Gửi qua SignalR Hub trực tiếp (vì API không có endpoint này)
      await sendToGroup(testGroup, testMessage);
      toast.success(`Gửi tin nhắn đến group ${testGroup} thành công!`);
    } catch (error) {
      toast.error('Không thể gửi tin nhắn đến group');
      console.error(error);
    }
  };

  const handleTestConnection = async () => {
    try {
      await signalRService.startConnection();
      toast.success('Thử kết nối lại thành công!');
    } catch (error) {
      toast.error('Không thể kết nối lại');
      console.error(error);
    }
  };

  const getConnectionStatusColor = () => {
    return isConnected ? "bg-green-500" : "bg-red-500";
  };

  const getConnectionStatusText = () => {
    switch (connectionInfo.state) {
      case 0: return "Disconnected";
      case 1: return "Connected"; 
      case 2: return "Connecting";
      case 3: return "Reconnecting";
      default: return "Unknown";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">SignalR + API Test</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`}></div>
            <Badge variant={isConnected ? "default" : "destructive"}>
              SignalR: {getConnectionStatusText()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              apiConnected === null ? 'bg-gray-400' : 
              apiConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <Badge variant={
              apiConnected === null ? "secondary" : 
              apiConnected ? "default" : "destructive"
            }>
              API: {apiConnected === null ? 'Testing' : apiConnected ? 'Connected' : 'Failed'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Connection Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin kết nối</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Trạng thái:</strong> 
              <span className={isConnected ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                {getConnectionStatusText()}
              </span>
            </div>
            <div>
              <strong>Connection ID:</strong> 
              <code className="ml-2 text-xs bg-gray-100 px-1 rounded">
                {connectionId || 'N/A'}
              </code>
            </div>
            <div>
              <strong>Số lần reconnect:</strong> 
              <span className="ml-2">{connectionInfo.reconnectAttempts}</span>
            </div>
            <div>
              <strong>Max reconnect:</strong> 
              <span className="ml-2">{connectionInfo.maxReconnectAttempts}</span>
            </div>
            <div className="col-span-2">
              <strong>Hub URL:</strong> 
              <code className="ml-2 text-xs bg-gray-100 px-1 rounded">
                {process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || 'Not configured'}
              </code>
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              onClick={handleTestConnection}
              variant="outline"
              disabled={isConnected}
            >
              {isConnected ? "Đã kết nối" : "Thử kết nối lại"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="signalr" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="signalr">SignalR Hub Test</TabsTrigger>
          <TabsTrigger value="api">API Endpoints Test</TabsTrigger>
          <TabsTrigger value="notifications">My Notifications</TabsTrigger>
        </TabsList>

        {/* SignalR Hub Testing */}
        <TabsContent value="signalr" className="space-y-6">
          {/* Connection Info */}
          <Card>
            <CardHeader>
              <CardTitle>SignalR Hub Connection Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Trạng thái:</strong> 
                  <span className={isConnected ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                    {getConnectionStatusText()}
                  </span>
                </div>
                <div>
                  <strong>Connection ID:</strong> 
                  <code className="ml-2 text-xs bg-gray-100 px-1 rounded">
                    {connectionId || 'N/A'}
                  </code>
                </div>
                <div>
                  <strong>Số lần reconnect:</strong> 
                  <span className="ml-2">{connectionInfo.reconnectAttempts}</span>
                </div>
                <div>
                  <strong>Max reconnect:</strong> 
                  <span className="ml-2">{connectionInfo.maxReconnectAttempts}</span>
                </div>
                <div className="col-span-2">
                  <strong>Hub URL:</strong> 
                  <code className="ml-2 text-xs bg-gray-100 px-1 rounded">
                    {process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || 'Not configured'}
                  </code>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  onClick={handleTestConnection}
                  variant="outline"
                  disabled={isConnected}
                >
                  {isConnected ? "Đã kết nối" : "Thử kết nối lại"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SignalR Direct Methods */}
          <Card>
            <CardHeader>
              <CardTitle>SignalR Hub Methods (Direct)</CardTitle>
              <p className="text-sm text-gray-600">Gọi trực tiếp methods trong NotificationHub</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Send to Group</h4>
                  <Input
                    placeholder="Group name"
                    value={testGroup}
                    onChange={(e) => setTestGroup(e.target.value)}
                  />
                  <Input
                    placeholder="Message"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                  />
                  <Button 
                    onClick={handleSendToGroup}
                    disabled={!isConnected}
                    className="w-full"
                    variant="secondary"
                  >
                    Hub: Send to Group
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Endpoints Testing */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    apiConnected === null ? 'bg-gray-400' : 
                    apiConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm">
                    API Status: {
                      apiConnected === null ? 'Testing...' : 
                      apiConnected ? 'Connected' : 'Failed'
                    }
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setApiConnected(null);
                    const result = await notificationApiService.testApiConnection();
                    setApiConnected(result);
                  }}
                >
                  Test API
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API: Send to User</CardTitle>
                <p className="text-sm text-gray-600">POST /api/Notifications/send</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">User ID (GUID):</label>
                  <Input
                    value={testUserId}
                    onChange={(e) => setTestUserId(e.target.value)}
                    placeholder="123e4567-e89b-12d3-a456-426614174000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message:</label>
                  <Input
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Hello from API!"
                  />
                </div>
                <Button 
                  onClick={handleSendToUser}
                  disabled={!apiConnected}
                  className="w-full"
                >
                  API: Send to User
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API: Send to All</CardTitle>
                <p className="text-sm text-gray-600">POST /api/Notifications/send-all</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Message:</label>
                  <Input
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Hello everyone from API!"
                  />
                </div>
                <Button 
                  onClick={handleSendToAll}
                  disabled={!apiConnected}
                  className="w-full"
                  variant="outline"
                >
                  API: Send to All
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <NotificationList userId={testUserId} />
        </TabsContent>
      </Tabs>

      {/* Received Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Thông báo nhận được
            <Badge variant="outline">{notifications.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Chưa nhận được thông báo nào. Thử gửi tin nhắn để test!
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 rounded text-sm border-l-4 border-blue-500"
                >
                  {notification}
                </div>
              ))}
            </div>
          )}
          
          {notifications.length > 0 && (
            <Button
              onClick={() => setNotifications([])}
              variant="ghost"
              size="sm"
              className="mt-4"
            >
              Xóa tất cả
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 rounded">
              <h4 className="font-semibold mb-2">✅ Kiểm tra kết nối thành công:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Trạng thái hiển thị "Connected" và có màu xanh</li>
                <li>• Connection ID được hiển thị</li>
                <li>• Console log hiển thị "✅ SignalR connected successfully"</li>
                <li>• Toast notification "Kết nối thông báo thành công"</li>
              </ul>
            </div>
            
            <div className="p-3 bg-green-50 rounded">
              <h4 className="font-semibold mb-2">🧪 Cách test messaging:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>Send to User:</strong> Backend sẽ gửi tin nhắn đến user có ID cụ thể</li>
                <li>• <strong>Send to All:</strong> Backend sẽ broadcast tin nhắn đến tất cả client đang kết nối</li>
                <li>• <strong>Send to Group:</strong> Backend sẽ gửi tin nhắn đến tất cả client trong group</li>
                <li>• Mở nhiều tab để test Send to All</li>
              </ul>
            </div>

            <div className="p-3 bg-yellow-50 rounded">
              <h4 className="font-semibold mb-2">🔧 Backend methods được gọi:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• <code>SendToUser(userId, message)</code></li>
                <li>• <code>SendToAll(message)</code></li>
                <li>• <code>SendToGroup(groupName, message)</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
