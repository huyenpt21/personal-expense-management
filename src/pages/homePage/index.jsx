import { Col, DatePicker, Row, Table } from "antd";
import { apiInstance } from "../../api";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const columnTable = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Create At",
    dataIndex: "createAt",
    key: "createAt",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];

export default function HomePage() {
  const [record, setRecord] = useState([]);
  const [query, setQuery] = useState({
    month: null,
    year: null,
  });
  useEffect(() => {
    apiInstance
      .get("expense/get-all", { params: query })
      .then((listExpenses) => {
        if (Array.isArray(listExpenses)) {
          setRecord(listExpenses);
        }
      });
  }, [query]);

  console.log(333, record);
  const handleChangeMonth = (value) => {
    const month = dayjs(value).month() + 1;
    const year = dayjs(value).year();
    setQuery({
      month,
      year,
    });
  };
  const handleChangeYear = (value) => {
    const year = dayjs(value).year();
    setQuery({
      month: null,
      year,
    });
  };

  return (
    <div className="container">
      <div className="filter__section">
        <Row>
          <Col span={8}>
            <div>Month:</div>
            <DatePicker picker="month" onChange={handleChangeMonth} />
          </Col>
          <Col span={8}>
            <div>Year:</div>
            <DatePicker picker="year" onChange={handleChangeYear} />
          </Col>
        </Row>
      </div>
      <Table dataSource={record} columns={columnTable} />
    </div>
  );
}
