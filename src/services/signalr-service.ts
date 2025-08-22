import * as signalR from "@microsoft/signalr";
import { toast } from "react-hot-toast";

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  userId?: string;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private notificationCallbacks: ((data: NotificationData) => void)[] = [];
  private connectionCallbacks: (() => void)[] = [];
  private disconnectionCallbacks: ((error?: Error) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeConnection();
    }
  }

  private initializeConnection() {
    const hubUrl = process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || "https://localhost:7111/notificationHub";
    
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => {
          if (typeof window !== 'undefined') {
            return localStorage.getItem("jwtToken") || "";
          }
          return "";
        },
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    // Xử lý khi nhận được thông báo từ server (backend gửi string message)
    this.connection.on("ReceiveNotification", (message: string) => {
      console.log("📩 Nhận thông báo từ server:", message);
      
      // Tạo NotificationData object từ message string
      const notificationData: NotificationData = {
        id: Date.now().toString(),
        title: "Thông báo mới",
        message: message,
        type: 'info',
        timestamp: new Date(),
      };
      
      // Gọi tất cả callback đã đăng ký
      this.notificationCallbacks.forEach(callback => callback(notificationData));
      
      // Hiển thị toast notification
      this.showToastNotification(notificationData);
    });

    // Xử lý khi kết nối thành công lần đầu
    this.connection.onreconnected((connectionId) => {
      console.log("✅ SignalR đã kết nối lại thành công. Connection ID:", connectionId);
      this.reconnectAttempts = 0;
      toast.success("Kết nối thông báo đã được khôi phục");
    });

    // Xử lý khi đang kết nối lại
    this.connection.onreconnecting(() => {
      console.log("🔄 Đang kết nối lại SignalR...");
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        toast.loading("Đang kết nối lại...", { id: "signalr-reconnect" });
      }
    });

  // Xử lý khi mất kết nối
    this.connection.onclose((error) => {
      console.log("❌ SignalR connection closed:", error);
      
      // Gọi tất cả disconnection callbacks
      this.disconnectionCallbacks.forEach(callback => callback(error || undefined));
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error("Mất kết nối thông báo. Vui lòng tải lại trang.");
      }
    });
  }

  private showToastNotification(data: NotificationData) {
    const toastOptions = {
      duration: 5000,
      position: 'top-right' as const,
    };

    switch (data.type) {
      case 'success':
        toast.success(data.message, toastOptions);
        break;
      case 'error':
        toast.error(data.message, toastOptions);
        break;
      case 'warning':
        toast.error(data.message, toastOptions); // Ant Design doesn't have warning toast
        break;
      default:
        toast(data.message, toastOptions);
    }
  }

  // Bắt đầu kết nối
  public async startConnection(): Promise<void> {
    if (this.isConnecting || this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (!this.connection) {
      this.initializeConnection();
    }

    try {
      this.isConnecting = true;
      await this.connection?.start();
      console.log("✅ SignalR connected successfully. Connection ID:", this.connection?.connectionId);
      
      // Gọi tất cả connection callbacks
      this.connectionCallbacks.forEach(callback => callback());
      
      toast.success("Kết nối thông báo thành công");
    } catch (error) {
      console.error("❌ SignalR connection failed:", error);
      toast.error("Không thể kết nối đến server thông báo");
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  // Dừng kết nối
  public async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      console.log("🛑 SignalR connection stopped");
    }
  }

  // Đăng ký callback để nhận thông báo
  public onNotification(callback: (data: NotificationData) => void): () => void {
    this.notificationCallbacks.push(callback);
    
    // Trả về function để hủy đăng ký
    return () => {
      const index = this.notificationCallbacks.indexOf(callback);
      if (index > -1) {
        this.notificationCallbacks.splice(index, 1);
      }
    };
  }

  // Gửi thông báo đến user cụ thể (phù hợp với backend)
  public async sendToUser(userId: string, message: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("SendToUser", userId, message);
        console.log("✅ Message sent to user successfully");
      } catch (error) {
        console.error("❌ Failed to send message to user:", error);
        throw error;
      }
    } else {
      throw new Error("SignalR connection is not established");
    }
  }

  // Gửi thông báo đến tất cả users (phù hợp với backend)
  public async sendToAll(message: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("SendToAll", message);
        console.log("✅ Message sent to all users successfully");
      } catch (error) {
        console.error("❌ Failed to send message to all:", error);
        throw error;
      }
    } else {
      throw new Error("SignalR connection is not established");
    }
  }

  // Gửi thông báo đến group (phù hợp với backend)
  public async sendToGroup(groupName: string, message: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("SendToGroup", groupName, message);
        console.log(`✅ Message sent to group ${groupName} successfully`);
      } catch (error) {
        console.error(`❌ Failed to send message to group ${groupName}:`, error);
        throw error;
      }
    } else {
      throw new Error("SignalR connection is not established");
    }
  }

  // Method cũ để tương thích ngược
  public async sendNotification(userId: string, message: string): Promise<void> {
    return this.sendToUser(userId, message);
  }

  // Tham gia nhóm (nếu server hỗ trợ)
  public async joinGroup(groupName: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("JoinGroup", groupName);
        console.log(`✅ Joined group: ${groupName}`);
      } catch (error) {
        console.error(`❌ Failed to join group ${groupName}:`, error);
        throw error;
      }
    }
  }

  // Rời khỏi nhóm (nếu server hỗ trợ)
  public async leaveGroup(groupName: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("LeaveGroup", groupName);
        console.log(`✅ Left group: ${groupName}`);
      } catch (error) {
        console.error(`❌ Failed to leave group ${groupName}:`, error);
        throw error;
      }
    }
  }

  // Kiểm tra trạng thái kết nối
  public getConnectionState(): signalR.HubConnectionState {
    return this.connection?.state || signalR.HubConnectionState.Disconnected;
  }

  // Kiểm tra xem có đang kết nối không
  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  // Lắng nghe sự kiện kết nối thành công
  public onConnected(callback: () => void): () => void {
    this.connectionCallbacks.push(callback);
    
    // Nếu đã kết nối rồi thì gọi ngay
    if (this.isConnected()) {
      callback();
    }
    
    // Trả về function để hủy đăng ký
    return () => {
      const index = this.connectionCallbacks.indexOf(callback);
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1);
      }
    };
  }

  // Lắng nghe sự kiện mất kết nối
  public onDisconnected(callback: (error?: Error) => void): () => void {
    this.disconnectionCallbacks.push(callback);
    
    // Trả về function để hủy đăng ký
    return () => {
      const index = this.disconnectionCallbacks.indexOf(callback);
      if (index > -1) {
        this.disconnectionCallbacks.splice(index, 1);
      }
    };
  }

  // Lấy Connection ID
  public getConnectionId(): string | undefined {
    return this.connection?.connectionId || undefined;
  }

  // Lấy thông tin chi tiết về kết nối
  public getConnectionInfo() {
    return {
      state: this.getConnectionState(),
      connectionId: this.getConnectionId(),
      isConnected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
    };
  }
}

// Tạo instance singleton
export const signalRService = new SignalRService();
export default signalRService;
