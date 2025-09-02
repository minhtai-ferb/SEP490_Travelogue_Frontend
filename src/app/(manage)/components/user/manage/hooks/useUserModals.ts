"use client";

import { useState } from "react";
import { User } from "@/types/Users";
import { useRouter } from "next/navigation";

export const useUserModals = ({ href }: { href: string }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roleManagerOpen, setRoleManagerOpen] = useState(false);
  const router = useRouter();
  const openUserDetails = (user: User) => {
    // setSelectedUser(user);
    // setDrawerOpen(true);
    router.push(`${href}/user/${user.id}`);
  };

  const closeUserDetails = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  const openRoleManager = (user: User) => {
    setSelectedUser(user);
    setRoleManagerOpen(true);
  };

  const closeRoleManager = () => {
    setRoleManagerOpen(false);
    setSelectedUser(null);
  };

  return {
    selectedUser,
    drawerOpen,
    roleManagerOpen,
    openUserDetails,
    closeUserDetails,
    openRoleManager,
    closeRoleManager,
  };
};
