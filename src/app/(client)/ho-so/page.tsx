"use client";

import { useState } from "react";
import SettingsTabs from "./components/settings-tabs";

export default function SettingsPage() {
 
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-xl font-semibold mb-6">Cài đặt</h1>
      <SettingsTabs/>
    </div>
  );
}
