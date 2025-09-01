"use client";

import React from "react";
import LoadingContent from "@/components/common/loading-content";

import UserStatistics from "./components/UserStatistics";
import FilterSection from "./components/FilterSection";
import UserTable from "./components/UserTable";
import UserDetailDrawer from "./components/UserDetailDrawer";
import UserRoleManager from "./components/UserRoleManager";
import { useUserFilters } from "./hooks/useUserFilters";
import { useTableState } from "./hooks/useTableState";
import { useUserData } from "./hooks/useUserData";
import { useUserModals } from "./hooks/useUserModals";

function ManageUserTable({ href }: { href: string }) {
  // Custom hooks for data management
  const { users, roles, loading, refetchUsers } = useUserData();
  
  // Custom hooks for filtering
  const {
    searchValue,
    setSearchValue,
    selectedRoleIds,
    setSelectedRoleIds,
    advancedFilters,
    setAdvancedFilters,
    filteredUsers
  } = useUserFilters({ users, roles });
  
  // Custom hooks for table state
  const { tableParams, handleTableChange } = useTableState();
  
  // Custom hooks for modal management
  const {
    selectedUser,
    drawerOpen,
    roleManagerOpen,
    openUserDetails,
    closeUserDetails,
    openRoleManager,
    closeRoleManager
  } = useUserModals({ href });

  return (
    <div className="w-full min-w-0">
      {loading ? (
        <LoadingContent />
      ) : (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <UserStatistics users={users} />

          {/* Filters and Search */}
          <FilterSection
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            users={users}
            filteredUsers={filteredUsers}
            roles={roles}
            selectedRoleIds={selectedRoleIds}
            onRoleFilterChange={setSelectedRoleIds}
            onFilterChange={setAdvancedFilters}
            totalUsers={users.length}
          />

          {/* Main Table */}
          <UserTable
            users={filteredUsers}
            loading={loading}
            tableParams={tableParams}
            onTableChange={handleTableChange}
            onViewUserDetails={openUserDetails}
            onManageUserRoles={openRoleManager}
          />
        </div>
      )}
      
      {/* User Detail Drawer */}
      <UserDetailDrawer
        user={selectedUser}
        open={drawerOpen}
        onClose={closeUserDetails}
      />
      
      {/* User Role Manager */}
      <UserRoleManager
        user={selectedUser}
        open={roleManagerOpen}
        onClose={closeRoleManager}
        onUserUpdated={refetchUsers}
      />
    </div>
  );
}

export default ManageUserTable;
