import { Button, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { apiInstance } from "../../api";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    title: "Invoice Number",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Tax rate",
    dataIndex: "tax_rate",
    key: "tax_rate",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Adress",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Create Date",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Seller",
    dataIndex: "seller",
    key: "seller",
  },
  {
    title: "Serial",
    dataIndex: "serial",
    key: "serial",
  },
  {
    title: "Tax Code",
    dataIndex: "tax_code",
    key: "tax_code",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];

const dataMock = [
  {
    _id: "6440ded980dce612a51003f9",
    username: "nguyenminh@gmail.com",
    table: [
      {
        description: "Phí vận chuyển [941303672]",
        amount: 17593,
        tax_rate: 8,
      },
    ],
    base64_image: "",
    isExtracted: true,
    isExpensed: false,
    createdAt: "2023-04-20T06:42:33.569Z",
    updatedAt: "2023-04-20T06:42:57.477Z",
    __v: 0,
    address: "52 Út Tịch, Phường 4, Quận Tân Bình, TP. Hồ Chí Minh, Việt Nam",
    date: "01/04/2022",
    invoice_number: 6019841,
    seller: "CÔNG TY TNHH MTV THƯƠNG MẠI TI KI",
    serial: "aa/21e",
    tax_code: "0312388363",
  },
];

export default function ListInvoices() {
  const navigate = useNavigate();
  const [record, setRecord] = useState([]);
  useEffect(() => {
    apiInstance
      .get("invoice/get-all")
      .then(({ data: listInvoices }) => {
        const listMock = dataMock.map((el) => ({
          ...el,
          description: el.table[0].description,
          amount: el.table[0].amount,
          tax_rate: el.table[0].tax_rate,
          createdAt: dayjs(el.createdAt).format("DD/MM/YYYY"),
          action: <div></div>,
        }));
        console.log(333, listMock);
        setRecord(listMock);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <div className="filter__section">
        <Row className="header">
          <h2>List invoices</h2>
          <Button type="primary" onClick={() => navigate("/")}>
            Back
          </Button>
        </Row>
      </div>
      <Table dataSource={record} columns={columns} />;
    </div>
  );
}
