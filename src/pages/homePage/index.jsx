import { Button, Col, DatePicker, Row } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiInstance } from "../../api";
import { Bar, getElementAtEvent } from "react-chartjs-2";
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
  const barRef = useRef();
  const [record, setRecord] = useState([]);
  const [dataExpense, setDataExpense] = useState([]);
  const [query, setQuery] = useState({
    year: dayjs().year(),
  });
  useEffect(() => {
    apiInstance
      .post("expense/get-year", query)
      .then(({ data: listExpenses }) => {
        if (Array.isArray(listExpenses)) {
          setDataExpense(listExpenses);
          const filterValue = listExpenses.sort(
            (prev, post) => prev.month < post.month
          );
          const fullMonthArray = Array(12).fill(0);
          for (const expense of filterValue) {
            fullMonthArray[expense.month - 1] = expense.amount;
          }
          setRecord(fullMonthArray);
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

  const handleClickChart = (event) => {
    const indexColumnClick = getElementAtEvent(barRef.current, event)[0]?.index;
    const expenseClicked = dataExpense.find(
      (el) => el?.month === indexColumnClick + 1
    );

    if (expenseClicked?._id) {
      navigate({
        pathname: `/list-invoices/${expenseClicked?._id}`,
        search: `month=${expenseClicked?.month}&year=${expenseClicked?.year}`,
      });
    }
  };

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
            <DatePicker
              picker="year"
              onChange={handleChangeYear}
              defaultValue={dayjs("2023-01-01", "YYYY-MM-DD")}
            />
          </Col>
        </Row>
        <Row
          style={{ height: "70vh", width: "80vw", justifyContent: "center" }}
        >
          <Bar
            ref={barRef}
            options={options}
            data={data}
            onClick={handleClickChart}
          />
        </Row>
      </div>
    </div>
  );
}
