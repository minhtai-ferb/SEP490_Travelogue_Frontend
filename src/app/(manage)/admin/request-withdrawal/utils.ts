export function formatVND(amount: number) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount?.toLocaleString?.("vi-VN") ?? amount} ₫`;
  }
}


export type PaymentInfo = {
  amount: number;            // số tiền (VND)
  accountNumber: string;     // số tài khoản nhận
  accountName: string;       // tên chủ TK
  bankName: string;          // MÃ NGÂN HÀNG theo VietQR (VD: VCB, BIDV, ACB, TCB...), hoặc "vietcombank"
  transferInfo: string;      // nội dung chuyển khoản
};

export function generateQRUrl(paymentInfo: PaymentInfo): string {
  const { amount, accountNumber, accountName, transferInfo, bankName } = paymentInfo;
  return `https://img.vietqr.io/image/${bankName}-${accountNumber}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(
    transferInfo,
  )}&accountName=${encodeURIComponent(accountName)}`;
}