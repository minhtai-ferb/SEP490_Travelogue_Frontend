export interface NotificationRequest {
  userId: string;
  message: string;
}

export interface NotificationAllRequest {
  message: string;
}

export interface BackendNotification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  // Thêm các field khác từ backend nếu có
}

class NotificationApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7111';
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwtToken');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // Gửi thông báo đến user cụ thể qua API
  public async sendNotificationToUser(userId: string, message: string): Promise<any> {
    const request: NotificationRequest = {
      userId,
      message,
    };

    return this.fetchWithAuth('notifications/send', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Gửi thông báo đến tất cả users qua API  
  public async sendNotificationToAll(message: string): Promise<any> {
    const request: NotificationAllRequest = {
      message,
    };

    return this.fetchWithAuth('notifications/send-all', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Lấy danh sách thông báo của user
  public async getUserNotifications(userId: string): Promise<BackendNotification[]> {
    return this.fetchWithAuth(`notifications/${userId}`);
  }

  // Đánh dấu thông báo đã đọc
  public async markNotificationAsRead(notificationId: string): Promise<void> {
    return this.fetchWithAuth(`notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  // Test kết nối API
  public async testApiConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}notifications/test`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}

export const notificationApiService = new NotificationApiService();
export default notificationApiService;
