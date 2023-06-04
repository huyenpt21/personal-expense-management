import { Column } from "@ant-design/charts";
import { Button, Col, DatePicker, Row } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiInstance } from "../../api";

export default function HomePage() {
  const navigate = useNavigate();
  const [record, setRecord] = useState([]);
  const [query, setQuery] = useState({
    year: dayjs().year(),
  });
  useEffect(() => {
    apiInstance
      .get("expense/get-all", { params: query })
      .then(({ data: listExpenses }) => {
        if (Array.isArray(listExpenses)) {
          const filterValue = listExpenses.sort(
            (prev, post) => prev.month < post.month
          );
          const fullMonthArray = Array.from(Array(12).keys()).map(
            (el, index) => ({
              month: el + 1,
              amount: filterValue[index]?.amount ?? 1230376,
            })
          );
          setRecord(fullMonthArray);
          console.log(fullMonthArray);
        }
      });
  }, [navigate, query]);

  const handleChangeYear = (value) => {
    const year = dayjs(value).year();
    setQuery({
      month: null,
      year,
    });
  };

  const config = {
    data: record,
    xField: "month",
    yField: "amount",
    label: {
      position: "middle",
      style: {
        fill: "#FFF",
        opacity: 1,
      },
    },
  };

  return (
    <div className="container">
      <div className="filter__section">
        <Row className="header">
          <h2 className="title">List Expenses</h2>
          <Row className="header">
            <Button
              onClick={() => {
                navigate("/list-invoices");
              }}
              type="primary"
            >
              View all invoices
            </Button>
            <Button
              type="primary"
              onClick={() => {
                navigate("/upload-invoice");
              }}
            >
              Upload
            </Button>
            <Button
              type="primary"
              onClick={() => {
                localStorage.removeItem("access_token");
                navigate("/");
              }}
            >
              Logout
            </Button>
          </Row>
        </Row>
        <Row>
          <Col span={8}>
            <div>Year:</div>
            <DatePicker picker="year" onChange={handleChangeYear} />
          </Col>
        </Row>
      </div>
      <Column {...config} />
    </div>
  );
}
