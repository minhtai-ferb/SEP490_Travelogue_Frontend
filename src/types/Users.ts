export type Role = {
    name: string;
    createdAt: string;
    isActive: boolean;
};

export type Wallet = {
    userWalletAmount: number;
    transactionDtos: any[];
};

export type TourGuideInfo = {
    id: string;
    rating: number;
    price: number;
    introduction: string;
    totalReviews: number;
    certifications: any[];
};

export type CraftVillagesInfo = {
    id: string;
    phoneNumber: string;
    email: string;
    website: string;
    signatureProduct: string;
    yearsOfHistory: number;
    isRecognizedByUnesco: boolean;
    workshopsAvailable: boolean;
    locationId: string;
};

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
    email: string;
    userName: string;
    emailConfirmed?: boolean;
    phoneNumber?: string;
    phoneNumberConfirmed?: boolean;
    fullName: string;
    avatarUrl?: string;
    roles: Role[];
    sex: number;
    genderText: string;
    address?: string;
    isEmailVerified?: boolean;
    lockoutEnd?: string;
    bankAccounts: any[];
    wallet: Wallet;
    tourGuideInfo?: TourGuideInfo;
    craftVillagesInfo?: CraftVillagesInfo;
    createdTime: string;
    lastUpdatedTime: string;
    createdBy?: string;
    createdByName?: string;
    lastUpdatedBy?: string;
    lastUpdatedByName?: string;
};
