"use client";

import { useState } from "react";
import VerificationAlert from "./verificationAlert";
import SettingsTabs from "./settings-tabs";
import Sidebar from "./sidebar";

export default function SettingsLayout() {
  const [activeTab, setActiveTab] = useState<string>("account");

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Sidebar onSelectTab={(val) => setActiveTab(val)} />
        <main className="flex-1">
          <VerificationAlert />
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-xl font-semibold mb-6">Cài đặt</h1>
            <SettingsTabs activeTab={activeTab} onChangeTab={setActiveTab} />
          </div>
        </main>
      </div>
    </div>
  );
}