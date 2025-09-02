"use client";

import React from "react";
import { SystemRevenueChart } from "./components/chart-line-interactive";
import TransactionTable from "./components/transaction-table";
import TopTransactionLatest from "./components/top-transaction-latest";

export default function SystemDashboard() {
  return (
    <div className="absolute top-16 left-0 right-0 bottom-0 flex flex-col gap-4 p-4 overflow-y-auto">
      <div className="mb-4 w-full">
        <SystemRevenueChart />
      </div>
      
      <div className="flex gap-4 mb-4">
        <div className="w-1/2">
          <TopTransactionLatest />
        </div>
        <div className="w-1/2">
          {/* Có thể thêm component khác ở đây */}
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <TransactionTable />
      </div>
    </div>
  );
}
