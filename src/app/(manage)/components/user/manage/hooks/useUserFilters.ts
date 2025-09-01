import { useState, useEffect } from "react";
import { User } from "@/types/Users";
import { FilterOptions } from "../components/AdvancedFilters";

type Role = {
  id: string;
  name: string;
};

interface UseUserFiltersProps {
  users: User[];
  roles: Role[];
}

export const useUserFilters = ({ users, roles }: UseUserFiltersProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({});
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Filter users based on search and role filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchValue) {
      filtered = filtered.filter((user) =>
        user.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.userName?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Role filter
    if (selectedRoleIds.length > 0) {
      const selectedRoleNames = roles
        .filter((r) => selectedRoleIds.includes(r.id))
        .map((r) => r.name);
      
      filtered = filtered.filter((user) => {
        const userRoleNames = user.roles?.map(role => role.name) || [];
        return selectedRoleNames.some((roleName) => userRoleNames.includes(roleName));
      });
    }

    // Advanced filters
    if (advancedFilters.emailVerified !== null && advancedFilters.emailVerified !== undefined) {
      filtered = filtered.filter((user) => user.isEmailVerified === advancedFilters.emailVerified);
    }

    if (advancedFilters.hasActiveRoles !== null && advancedFilters.hasActiveRoles !== undefined) {
      filtered = filtered.filter((user) => {
        const hasActive = user.roles?.some(role => role.isActive) || false;
        return hasActive === advancedFilters.hasActiveRoles;
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchValue, selectedRoleIds, roles, advancedFilters]);

  return {
    searchValue,
    setSearchValue,
    selectedRoleIds,
    setSelectedRoleIds,
    advancedFilters,
    setAdvancedFilters,
    filteredUsers
  };
};
