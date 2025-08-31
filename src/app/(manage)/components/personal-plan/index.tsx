"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TripPlanTable from "./table";
import TripPlanStats from "./stats";
import { useTripPlan } from "@/services/use-trip-plan";
import { TripPlan } from "@/types/TripPlan";

// Example component showing how to use the TripPlanTable
export default function PersonalPlanManagement({href} : {href: string}) {
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getAllTripPlanSearch } = useTripPlan();

  const fetchTripPlans = async () => {
    setLoading(true);
    try {
      const response = await getAllTripPlanSearch({
        title: '',
      });
      setTripPlans(response || []);
    } catch (error) {
      console.error("Error fetching trip plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripPlans();
  }, []);

  const handleView = (tripPlan: TripPlan) => {
    console.log("View trip plan:", tripPlan);
    router.push(`${href}/${tripPlan.id}`);
  };

  const handleEdit = (tripPlan: TripPlan) => {
    console.log("Edit trip plan:", tripPlan);
    // Implement edit logic - navigate to edit page
  };

  const handleDelete = (tripPlan: TripPlan) => {
    console.log("Delete trip plan:", tripPlan);
    // Implement delete logic - show confirmation dialog
  };

  return (
    <div className="container mx-auto p-6">
      {/* Statistics Overview */}
      <TripPlanStats tripPlans={tripPlans} loading={loading} />
      
      {/* Trip Plans Table */}
      <TripPlanTable
        data={tripPlans}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
