export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  bankAccountNumber: string;
  bankOwnerName: string;
  isDefault: boolean;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  walletId: string;
  amount: number;
  status: WithdrawalStatus;
  statusText: string;
  bankAccountId: string;
  bankAccount: BankAccount;
  requestTime: string;
}

export enum WithdrawalStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export function getWithdrawalStatusText(status: WithdrawalStatus): string {
  switch (status) {
    case WithdrawalStatus.PENDING:
      return "Chờ xử lý";
    case WithdrawalStatus.APPROVED:
      return "Đã chấp nhận";
    case WithdrawalStatus.REJECTED:
      return "Đã từ chối";
    default:
      return "Không xác định";
  }
}