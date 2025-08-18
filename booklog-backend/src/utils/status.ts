export const statusMap: { [key: number]: string } = {
  1: "未読",
  2: "読書中",
  3: "読了",
};

export const getStatusLabel = (status: number): string => {
  return statusMap[status] || "未設定";
}