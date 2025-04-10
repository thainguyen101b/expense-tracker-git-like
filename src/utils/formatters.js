export function formatCurrency(value) {
  if (typeof value !== "number") {
    return '0đ';
  }
  // Định dạng tiền tệ Việt Nam Đồng
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export function formatDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
