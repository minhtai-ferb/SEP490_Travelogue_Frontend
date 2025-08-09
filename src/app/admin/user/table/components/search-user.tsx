"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { SidebarInput } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
    return (
        <div className="relative flex items-center py-4">
            <Label htmlFor="search" className="sr-only">
                Search
            </Label>
            <SidebarInput
                id="search"
                placeholder="Tìm kiếm người dùng..."
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="pl-10 max-w-sm" // Thêm padding-left để tránh đè lên icon
            />
            <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
    );
};

export default SearchInput;