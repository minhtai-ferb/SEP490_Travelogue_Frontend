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
