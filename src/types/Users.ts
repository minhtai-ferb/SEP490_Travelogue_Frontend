export type UserTable = {
    id: string;
    email: string;
    fullName: string;
    isEmailVerified?: boolean;
    phoneNumber: string;
    sex: boolean;
    createdTime: string;
    roles?: string[];
};


export type User = {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    avatarUrl?: string;
    isEmailVerified?: boolean;
    createdTime: string;
    lastUpdatedTime: string;
    createdBy: string;
    createdByName?: string;
    lastUpdatedBy: string;
    lastUpdatedByName?: string;
    lockoutEnd: string;
    roles?: string[];
};
