"use client";

import { SignalRConnectionTest } from '@/components/common/signalr-connection-test';

export default function SignalRTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SignalRConnectionTest />
    </div>
  );
}
