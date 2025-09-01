"use client";

import React from "react";
import { notification } from "antd";
import type { NotificationArgsProps } from "antd";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

class NotificationService {
  private static instance: NotificationService;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public success(message: string, description?: string, duration: number = 4.5) {
    notification.success({
      message,
      description,
      duration,
      placement: 'topRight',
    });
  }

  public error(message: string, description?: string, duration: number = 4.5) {
    notification.error({
      message,
      description,
      duration,
      placement: 'topRight',
    });
  }

  public warning(message: string, description?: string, duration: number = 4.5) {
    notification.warning({
      message,
      description,
      duration,
      placement: 'topRight',
    });
  }

  public info(message: string, description?: string, duration: number = 4.5) {
    notification.info({
      message,
      description,
      duration,
      placement: 'topRight',
    });
  }

  public userRoleEnabled(userName: string, roleName: string) {
    this.success(
      'Bật vai trò thành công',
      `Đã bật vai trò "${roleName}" cho người dùng ${userName}`,
      3
    );
  }

  public userRoleDisabled(userName: string, roleName: string) {
    this.warning(
      'Tắt vai trò thành công',
      `Đã tắt vai trò "${roleName}" cho người dùng ${userName}`,
      3
    );
  }

  public userUpdated(userName: string) {
    this.success(
      'Cập nhật thành công',
      `Thông tin người dùng ${userName} đã được cập nhật`,
      3
    );
  }

  public exportSuccess(format: string, recordCount: number) {
    this.success(
      'Xuất dữ liệu thành công',
      `Đã xuất ${recordCount} bản ghi định dạng ${format.toUpperCase()}`,
      3
    );
  }

  public operationError(operation: string, error?: string) {
    this.error(
      `Lỗi ${operation}`,
      error || 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.',
      5
    );
  }
}

export const notificationService = NotificationService.getInstance();

export default NotificationService;
