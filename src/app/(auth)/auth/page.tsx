"use client";

import React, { useEffect, useRef } from "react";
import AuthForm from "./components/auth-form";
import { useAtom } from "jotai";
import { userAtom } from "@/store/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { routeByRole } from "@/types/Roles";

function Authentication() {
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const hasRedirected = useRef(false); // Prevent infinite loops

  useEffect(() => {
    if (hasRedirected.current) return; // Already redirected, don't do it again
    
    const token = Cookies.get("jwtToken");
    const storedUser = localStorage.getItem("USER");

    if (token && (user || storedUser)) {
      // Get user roles from current user or stored user
      let roles: string[] = [];
      
      if (user?.roles) {
        roles = user.roles;
      } else if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          roles = parsedUser.roles || [];
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }
      
      console.log("Auth page - User has token and roles:", roles);
      
      // If user has roles, redirect to appropriate page
      if (roles.length > 0) {
        hasRedirected.current = true; // Set flag to prevent re-runs
        
        if (roles.length === 1) {
          // Single role - redirect directly to that role's page
          const normalizedRole = roles[0].toLowerCase();
          const target = routeByRole[normalizedRole];
          
          if (target) {
            console.log("Auth page - Redirecting to:", target);
            router.replace(target); // Use replace instead of push
            return;
          }
        } else {
          // Multiple roles - go to role selection page
          console.log("Auth page - Multiple roles, going to choose-role");
          router.replace("/auth/choose-role"); // Use replace instead of push
          return;
        }
      }
      
      // Fallback to homepage if no specific role routing
      console.log("Auth page - Fallback to homepage");
      hasRedirected.current = true;
      router.replace("/"); // Use replace instead of push
    }
  }, [user, router]);

  // Don't render AuthForm if we're in the process of redirecting
  const token = Cookies.get("jwtToken");
  const storedUser = localStorage.getItem("USER");
  
  if (token && (user || storedUser)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p>Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return <AuthForm />;
}

export default Authentication;
