export const statusMap = {
    1: "未読",
    2: "読書中",
    3: "読了",
};
export const getStatusLabel = (status) => {
    return statusMap[status] || "未設定";
};
