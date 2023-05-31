import { Button, Col, DatePicker, Row, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiInstance } from "../../api";
import { COLUMN_EXPENSE } from "../../helper";

export default function HomePage() {
  const navigate = useNavigate();
  const [record, setRecord] = useState([]);
  const [query, setQuery] = useState({
    month: dayjs().month() + 1,
    year: dayjs().year(),
  });
  useEffect(() => {
    apiInstance
      .get("expense/get-all", { params: query })
      .then(({ data: listExpenses }) => {
        if (Array.isArray(listExpenses)) {
          const filterValue = listExpenses.map((el) => {
            return {
              key: el._id,
              id: el._id,
              month: el.month,
              amount: el.amount,
              createdAt: dayjs(el.createdAt).format("DD/MM/YYYY"),
              updatedAt: dayjs(el.updatedAt).format("DD/MM/YYYY"),
              action: (
                <div className="action__icon">
                  <Tooltip title="View detail">
                    <svg
                      width="22px"
                      height="22px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        navigate({
                          pathname: `/list-invoices/${el._id}`,
                          search: `month=${el?.month}&year=${el.year}`,
                        });
                      }}
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="1"
                        stroke="#33363F"
                        stroke-width="2"
                      />
                      <path
                        d="M18.2265 11.3805C18.3552 11.634 18.4195 11.7607 18.4195 12C18.4195 12.2393 18.3552 12.366 18.2265 12.6195C17.6001 13.8533 15.812 16.5 12 16.5C8.18799 16.5 6.39992 13.8533 5.77348 12.6195C5.64481 12.366 5.58048 12.2393 5.58048 12C5.58048 11.7607 5.64481 11.634 5.77348 11.3805C6.39992 10.1467 8.18799 7.5 12 7.5C15.812 7.5 17.6001 10.1467 18.2265 11.3805Z"
                        stroke="#33363F"
                        stroke-width="2"
                      />
                      <path
                        d="M17 4H17.2C18.9913 4 19.887 4 20.4435 4.5565C21 5.11299 21 6.00866 21 7.8V8M17 20H17.2C18.9913 20 19.887 20 20.4435 19.4435C21 18.887 21 17.9913 21 16.2V16M7 4H6.8C5.00866 4 4.11299 4 3.5565 4.5565C3 5.11299 3 6.00866 3 7.8V8M7 20H6.8C5.00866 20 4.11299 20 3.5565 19.4435C3 18.887 3 17.9913 3 16.2V16"
                        stroke="#33363F"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </svg>
                  </Tooltip>
                  <Tooltip title="Upload invoice">
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        navigate("/upload-invoice");
                      }}
                    >
                      <path
                        d="M12 8L12 16"
                        stroke="#323232"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15 11L12.087 8.08704V8.08704C12.039 8.03897 11.961 8.03897 11.913 8.08704V8.08704L9 11"
                        stroke="#323232"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 15L3 16L3 19C3 20.1046 3.89543 21 5 21L19 21C20.1046 21 21 20.1046 21 19L21 16L21 15"
                        stroke="#323232"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </Tooltip>
                </div>
              ),
            };
          });
          setRecord(filterValue);
        }
      });
  }, [navigate, query]);

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
            <div>Month:</div>
            <DatePicker picker="month" onChange={handleChangeMonth} />
          </Col>
          <Col span={8}>
            <div>Year:</div>
            <DatePicker picker="year" onChange={handleChangeYear} />
          </Col>
        </Row>
      </div>
      <Table dataSource={record} columns={COLUMN_EXPENSE} />
    </div>
  );
}
