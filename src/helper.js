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
    title: "Invoice",
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
    title: "Is Expensed",
    dataIndex: "isExpensed",
    key: "isExpensed",
  },
  {
    title: "Is Extracted",
    dataIndex: "isExtracted",
    key: "isExtracted",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];
export const openNotification = (api, message) => {
  api.success({
    message: message,
    duration: 2,
  });
};
