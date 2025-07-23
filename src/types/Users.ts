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
