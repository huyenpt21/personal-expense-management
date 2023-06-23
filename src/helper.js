export const COLUMN_EXPENSE = [
  {
    title: "ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Month",
    dataIndex: "month",
    key: "month",
  },
  {
    title: "Create At",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Update At",
    dataIndex: "updatedAt",
    key: "updatedAt",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];

export const COLUMN_INVOICE = [
  {
    title: "ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Seller",
    dataIndex: "seller",
    key: "seller",
  },
  {
    title: "Tax Code",
    dataIndex: "tax_code",
    key: "tax_code",
  },
  {
    title: "Serial",
    dataIndex: "serial",
    key: "serial",
  },
  {
    title: "Invoice number",
    dataIndex: "invoice_number",
    key: "invoice_number",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Expensed",
    dataIndex: "isExpensed",
    key: "isExpensed",
  },
  {
    title: "Extracted",
    dataIndex: "isExtracted",
    key: "isExtracted",
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
  },
];
export const openNotification = (api, message, status = "success") => {
  api[status]({
    message: message,
    duration: 2,
  });
};
