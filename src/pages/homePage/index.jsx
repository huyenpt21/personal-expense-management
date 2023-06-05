import { Button, Col, DatePicker, Row } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiInstance } from "../../api";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

export default function HomePage() {
  const navigate = useNavigate();
  const [record, setRecord] = useState([
    20, 30, 50, 12, 34, 20, 20, 65, 37, 76, 56, 29,
  ]);
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

  Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `List expense in ${query.year}`,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Expense by month",
        data: record,
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        title: "hi",
      },
    ],
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
        <Row
          style={{ height: "70vh", width: "80vw", justifyContent: "center" }}
        >
          <Bar
            options={options}
            data={data}
            onClick={(data) => {
              console.log("click", data);
            }}
          />
        </Row>
      </div>
    </div>
  );
}
