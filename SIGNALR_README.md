# SignalR WebSocket Configuration

Cấu hình SignalR cho dự án Next.js để nhận thông báo real-time từ server C# ASP.NET Core.

# SignalR WebSocket + API Integration

Tích hợp đầy đủ SignalR WebSocket và REST API cho hệ thống thông báo real-time.

## 🏗️ Architecture

```
┌─────────────────┐    API Calls     ┌─────────────────┐
│   Frontend      │ ──────────────► │   Backend API   │
│   (Next.js)     │                  │   (ASP.NET)     │
│                 │ ◄────────────── │                 │
│                 │   SignalR Hub    │                 │
└─────────────────┘                  └─────────────────┘
        ▲                                     │
        │            Real-time Push           │  
        └─────────────────────────────────────┘
```

## 🎯 **Cách hoạt động:**

1. **Gửi thông báo**: Frontend gọi API → Backend lưu DB → Backend push qua SignalR
2. **Nhận thông báo**: SignalR Hub push real-time → Frontend hiển thị toast + cập nhật UI  
3. **Quản lý thông báo**: Frontend gọi API để lấy lịch sử, đánh dấu đã đọc

## 📡 **Backend API Endpoints**

### `POST /api/Notifications/send`
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "message": "Hello user!"
}
```

### `POST /api/Notifications/send-all`  
```json
{
  "message": "Hello everyone!"
}
```

### `GET /api/Notifications/{userId}`
Lấy danh sách thông báo của user

### `PUT /api/Notifications/{notificationId}/read`
Đánh dấu thông báo đã đọc

## 🚀 **Sử dụng**

### 1. Hook tích hợp (Khuyến nghị)

```tsx
import { useNotificationManager } from '@/hooks/use-notification-manager';

const MyComponent = () => {
  const {
    signalR,                    // SignalR connection info
    backendNotifications,       // Notifications từ API
    unreadCount,               // Số thông báo chưa đọc
    sendNotificationToUser,    // Gửi qua API
    sendNotificationToAll,     // Gửi đến tất cả qua API  
    markAsRead,               // Đánh dấu đã đọc
    markAllAsRead,            // Đánh dấu tất cả đã đọc
  } = useNotificationManager({
    userId: 'your-user-id',
    autoFetchOnMount: true,
  });

  return (
    <div>
      <p>Unread: {unreadCount}</p>
      <p>SignalR: {signalR.isConnected ? 'Connected' : 'Disconnected'}</p>
    </div>
  );
};
```

### 2. Component có sẵn

```tsx
import { NotificationPanel } from '@/components/common/notification-panel';

const Dashboard = () => (
  <NotificationPanel currentUserId="your-user-id" />
);
```

## 🧪 **Testing**

### Test Pages:
- **`/test-signalr`** - SignalR Hub testing
- **`/notification-demo`** - Full integration demo

### Kiểm tra kết nối thành công:

#### 1. **SignalR WebSocket:**
```javascript
// Console logs
✅ SignalR connected successfully. Connection ID: abc123xyz
🎉 SignalR connected successfully!

// UI Status  
SignalR: Connected 🟢
Connection ID: abc123xyz
```

#### 2. **API Connection:**
```javascript
// Test API endpoint
const result = await notificationApiService.testApiConnection();
console.log('API Connected:', result);

// UI Status
API: Connected 🟢
```

### Test Flow:

1. **Open `/notification-demo`**
2. **Check status**: SignalR + API = Connected 🟢  
3. **Send notification**: API call → Database → SignalR push
4. **Receive notification**: Real-time toast + UI update
5. **Check list**: Notification xuất hiện trong danh sách
6. **Mark as read**: Cập nhật trạng thái

## 🔄 **Complete Flow**

```
1. User clicks "Send to User" 
   ↓
2. Frontend calls API POST /api/Notifications/send
   ↓  
3. Backend saves to database
   ↓
4. Backend calls NotificationHub.SendToUser()
   ↓
5. SignalR pushes to target user
   ↓
6. Frontend receives via "ReceiveNotification" 
   ↓
7. Toast notification + UI update
```

## 📦 **Files Structure**

```
src/
├── services/
│   ├── signalr-service.ts           # SignalR Hub connection
│   └── notification-api-service.ts  # REST API calls
├── hooks/
│   ├── use-notification.ts          # SignalR notifications  
│   └── use-notification-manager.ts  # Full integration hook
├── components/
│   └── common/
│       ├── notification-center.tsx  # Dropdown notifications
│       ├── notification-list.tsx    # Full list with actions
│       ├── notification-panel.tsx   # Complete panel
│       └── signalr-connection-test.tsx # Testing tools
└── contexts/
    └── signalr-context.tsx          # Global SignalR state
```

## ⚙️ **Configuration**

### Environment Variables:
```env
NEXT_PUBLIC_SIGNALR_HUB_URL=https://localhost:7111/notificationHub
NEXT_PUBLIC_API_BASE_URL=https://localhost:7111
```

### Backend Requirements:
- ✅ NotificationHub với methods: `SendToUser`, `SendToAll`, `SendToGroup`
- ✅ NotificationsController với endpoints: `/send`, `/send-all`, `/{userId}`, `/{id}/read`
- ✅ JWT Authentication
- ✅ CORS configuration cho SignalR

## 🔍 **Debug & Troubleshooting**

### Check Connection:
```javascript
// Trong browser console
import { signalRService } from './src/services/signalr-service';
console.log(signalRService.getConnectionInfo());

import { notificationApiService } from './src/services/notification-api-service';  
const apiTest = await notificationApiService.testApiConnection();
console.log('API Connected:', apiTest);
```

### Common Issues:

1. **SignalR không kết nối được:**
   - Kiểm tra JWT token trong localStorage
   - Kiểm tra CORS backend
   - Kiểm tra URL hub đúng chưa

2. **API calls fail:**
   - Kiểm tra backend server chạy chưa
   - Kiểm tra Authorization header
   - Kiểm tra endpoint URLs

3. **Không nhận được notifications:**
   - Kiểm tra SignalR connected
   - Kiểm tra User ID đúng GUID format
   - Kiểm tra backend có gọi SendAsync không

## 🎉 **Features**

✅ **Real-time notifications** qua SignalR  
✅ **API integration** đầy đủ  
✅ **Auto reconnection** khi mất kết nối  
✅ **Toast notifications** tự động  
✅ **Notification management** (mark read, delete)  
✅ **Unread counter** real-time  
✅ **Connection monitoring** chi tiết  
✅ **TypeScript** đầy đủ  
✅ **Error handling** toàn diện  
✅ **Test pages** để debug  

Tất cả đã sẵn sàng để sử dụng! 🚀

## Sử dụng

### 1. Sử dụng Context (khuyến nghị)

```tsx
import { useSignalR } from '@/contexts/signalr-context';

const MyComponent = () => {
  const { 
    isConnected, 
    connectionId,
    connectionInfo,
    sendToUser, 
    sendToAll, 
    sendToGroup 
  } = useSignalR();
  
  const handleSendToAll = async () => {
    await sendToAll('Hello everyone!');
  };

  return (
    <div>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <p>Connection ID: {connectionId}</p>
      <button onClick={handleSendToAll}>Send to All</button>
    </div>
  );
};
```

### 2. Lắng nghe thông báo

```tsx
import { useNotification } from '@/hooks/use-notification';

const MyComponent = () => {
  useNotification({
    onNotification: (notification) => {
      console.log('Received:', notification);
      // notification.message chứa string từ backend
    }
  });

  return <div>Component content</div>;
};
```

### 3. Sử dụng trực tiếp service

```tsx
import { signalRService } from '@/services/signalr-service';

// Bắt đầu kết nối
await signalRService.startConnection();

// Lắng nghe kết nối thành công
const unsubscribe = signalRService.onConnected(() => {
  console.log('Connected! ID:', signalRService.getConnectionId());
});

// Gửi thông báo (phù hợp với backend)
await signalRService.sendToUser('user123', 'Hello user!');
await signalRService.sendToAll('Hello everyone!');
await signalRService.sendToGroup('admin-group', 'Hello admins!');

// Hủy đăng ký
unsubscribe();
```

## Cấu trúc dữ liệu

### Backend gửi (từ NotificationHub)
```csharp
await Clients.All.SendAsync("ReceiveNotification", "Hello from server");
```

### Frontend nhận (tự động convert)
```typescript
interface NotificationData {
  id: string;           // Auto-generated
  title: string;        // Default: "Thông báo mới"
  message: string;      // Từ backend
  type: 'info';         // Default
  timestamp: Date;      // Auto-generated
  userId?: string;
}
```

## API Methods (phù hợp Backend)

```typescript
// Gửi đến user cụ thể
await signalRService.sendToUser('userId', 'message');

// Gửi đến tất cả
await signalRService.sendToAll('message'); 

// Gửi đến group
await signalRService.sendToGroup('groupName', 'message');

// Method cũ (tương thích)
await signalRService.sendNotification('userId', 'message');
```

## Connection Monitoring

```typescript
import { signalRService } from '@/services/signalr-service';

// Lắng nghe kết nối thành công
signalRService.onConnected(() => {
  console.log('✅ Connected!');
});

// Lắng nghe mất kết nối
signalRService.onDisconnected((error) => {
  console.log('❌ Disconnected:', error);
});

// Lấy thông tin kết nối
const info = signalRService.getConnectionInfo();
console.log(info);
```

## Testing

### 1. Truy cập Test Page
```
http://localhost:3000/test-signalr
```

### 2. Kiểm tra trong Console
```javascript
// Import service trong browser console
import { signalRService } from './src/services/signalr-service';

// Kiểm tra trạng thái
console.log(signalRService.getConnectionInfo());

// Test gửi thông báo
signalRService.sendToAll('Test from console');
```

### 3. Mở nhiều tab để test
- Tab 1: Gửi `sendToAll('Hello')`
- Tab 2, 3: Sẽ nhận được thông báo

## Troubleshooting

### ❌ Không kết nối được
1. Kiểm tra backend server có chạy không
2. Kiểm tra URL trong `.env.local`
3. Kiểm tra JWT token trong localStorage
4. Xem console có lỗi CORS không

### ❌ Không nhận được thông báo  
1. Kiểm tra backend có gọi đúng method `SendAsync("ReceiveNotification", message)` không
2. Kiểm tra connection state = "Connected"
3. Thử gửi `sendToAll()` để test broadcast

### ❌ Connection bị disconnect
1. Kiểm tra token hết hạn
2. Backend server có restart không
3. Network có ổn định không

## Features

✅ **Auto reconnect** khi mất kết nối  
✅ **Connection monitoring** với callbacks  
✅ **Toast notifications** tự động  
✅ **Test page** đầy đủ `/test-signalr`  
✅ **Connection info** chi tiết  
✅ **Multiple send methods** phù hợp backend  
✅ **Error handling** toàn diện  
✅ **TypeScript support** đầy đủ  

## Connection Flow

```
1. User load page with JWT token
2. SignalRService auto initialize 
3. Call backend NotificationHub
4. Backend adds user to group user:${userId}
5. Frontend shows "Connected" status
6. Ready to send/receive messages
```

## Cấu trúc files

```
src/
├── services/
│   └── signalr-service.ts          # Service chính để quản lý kết nối SignalR
├── contexts/
│   └── signalr-context.tsx         # Context Provider cho toàn ứng dụng
├── hooks/
│   └── use-notification.ts         # Hook để sử dụng notifications
└── components/
    └── common/
        ├── notification-center.tsx # Component hiển thị thông báo
        └── signalr-demo.tsx       # Component demo
```

## Sử dụng

### 1. Sử dụng Context (khuyến nghị)

```tsx
import { useSignalR } from '@/contexts/signalr-context';

const MyComponent = () => {
  const { isConnected, sendNotification, joinGroup } = useSignalR();
  
  const handleSend = async () => {
    await sendNotification('userId', 'Hello!');
  };

  return (
    <div>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={handleSend}>Send Notification</button>
    </div>
  );
};
```

### 2. Lắng nghe thông báo

```tsx
import { useNotification } from '@/hooks/use-notification';

const MyComponent = () => {
  useNotification({
    onNotification: (notification) => {
      console.log('Received notification:', notification);
      // Xử lý thông báo tại đây
    },
    filterByUserId: 'specific-user-id', // Tùy chọn: lọc theo user
    filterByType: ['success', 'error']   // Tùy chọn: lọc theo loại
  });

  return <div>Component content</div>;
};
```

### 3. Hiển thị Notification Center

```tsx
import { NotificationCenter } from '@/components/common/notification-center';

const Header = () => (
  <header>
    <nav>
      {/* Other nav items */}
      <NotificationCenter />
    </nav>
  </header>
);
```

### 4. Sử dụng trực tiếp service

```tsx
import { signalRService } from '@/services/signalr-service';

// Bắt đầu kết nối
await signalRService.startConnection();

// Lắng nghe thông báo
const unsubscribe = signalRService.onNotification((notification) => {
  console.log('Notification:', notification);
});

// Gửi thông báo
await signalRService.sendNotification('userId', 'message');

// Tham gia/rời khỏi group
await signalRService.joinGroup('admin-group');
await signalRService.leaveGroup('admin-group');

// Dừng kết nối khi không cần
await signalRService.stopConnection();

// Hủy đăng ký lắng nghe
unsubscribe();
```

## Cấu trúc dữ liệu Notification

```typescript
interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  userId?: string;
}
```

## Server Events

Service sẽ lắng nghe các events sau từ server:

- `ReceiveNotification`: Nhận thông báo từ server
- Connection events: `onreconnected`, `onreconnecting`, `onclose`

## Server Methods (cần server implement)

- `SendNotificationToUser(userId, message)`: Gửi thông báo đến user cụ thể
- `JoinGroup(groupName)`: Tham gia group
- `LeaveGroup(groupName)`: Rời khỏi group

## Features

✅ Auto reconnect khi mất kết nối  
✅ Toast notifications tự động  
✅ Notification center với UI đẹp  
✅ Filter notifications theo user/type  
✅ Quản lý state kết nối  
✅ Error handling  
✅ TypeScript support  
✅ Context API integration  

## Demo

Truy cập `/demo/signalr` để xem demo hoặc import component `SignalRDemo`:

```tsx
import { SignalRDemo } from '@/components/common/signalr-demo';

const DemoPage = () => <SignalRDemo />;
```

## Troubleshooting

### Lỗi kết nối
1. Kiểm tra URL server trong `.env.local`
2. Đảm bảo server SignalR đang chạy
3. Kiểm tra token JWT trong localStorage

### Không nhận được thông báo
1. Kiểm tra console để xem có lỗi kết nối không
2. Đảm bảo server gửi đúng format NotificationData
3. Kiểm tra filter conditions trong useNotification hook

### Performance
- Service sử dụng singleton pattern để tránh multiple connections
- Auto cleanup khi component unmount
- Giới hạn tối đa 50 notifications trong memory
