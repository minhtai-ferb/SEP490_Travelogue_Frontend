"use client";

import React from "react";
import { Result, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

interface ErrorResultProps {
  message: string;
  onRetry: () => void;
}

export function ErrorResult({ message, onRetry }: ErrorResultProps) {
  return (
    <Result
      status="error"
      title="Có lỗi xảy ra"
      subTitle={message}
      extra={[
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={onRetry}
          key="retry"
        >
          Thử lại
        </Button>,
      ]}
    />
  );
}
