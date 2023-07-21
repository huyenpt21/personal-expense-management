import { Button, Col, Input, Row, Table, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiInstance } from "../../api";
import { COLUMN_SELLER } from "../../helper";

export default function ListSellers() {
  const navigate = useNavigate();
  const [record, setRecord] = useState([]);
  const [columnsRender, setColumnsRender] = useState([]);
  const [query, setQuery] = useState({ page: 1, limit: 10, search: "" });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loadingList, setLoadingList] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const typingSearchRef = useRef();

  useEffect(() => {
    setLoadingList(true);
    apiInstance
      .post("seller/get-all", query)
      .then(({ status, data: listSellers, totalPage }) => {
        setLoadingList(false);
        if (status === 200) {
          const listSellerConverted = listSellers.map((el) => ({
            ...el,
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
                      navigate(`/list-invoices/detail-from-seller`);
                      localStorage.setItem("invoiceId", el?._id);
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
              </div>
            ),
          }));
          setRecord(listSellerConverted);
          setPagination((prev) => ({ ...prev, total: totalPage * 10 }));
        }
      });
  }, [navigate, query]);
  useEffect(() => {
    const column = COLUMN_SELLER.map((el) => {
      switch (el.key) {
        case "seller":
          el.width = 400;
          break;
        case "tax_code":
          el.width = 150;
          break;
        case "quantity":
          el.width = 150;
          break;
        case "action":
          el.width = 80;
          break;
        case "total":
          el.width = 100;
          break;
        case "address":
          el.width = 500;
          break;
        default:
      }
      return {
        ...el,
        render: (data) => {
          if (Array.isArray(data)) {
            return data[0];
          }
          return data;
        },
      };
    });
    setColumnsRender(column);
  }, []);

  useEffect(() => {
    return () => {
      if (typingSearchRef.current) {
        clearTimeout(typingSearchRef.current);
      }
    };
  }, []);

  const handleChangeSearch = ({ target: { value } }) => {
    setValueSearch(value);
    if (typingSearchRef.current) {
      clearTimeout(typingSearchRef.current);
    }

    typingSearchRef.current = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: value }));
    }, 500);
  };

  return (
    <div className="container">
      <div className="filter__section">
        <Row className="header">
          <h2>List sellers</h2>
          <Button type="primary" onClick={() => navigate("/")}>
            Back
          </Button>
        </Row>
        <Row style={{ marginTop: "12px" }}>
          <Col span={6}>
            <Input
              value={valueSearch}
              onChange={handleChangeSearch}
              placeholder="Search"
              allowClear
            />
          </Col>
        </Row>
      </div>
      <Table
        dataSource={record}
        columns={columnsRender}
        key={(record) => record._id}
        pagination={pagination}
        onChange={(paginationSettings) => {
          setPagination(paginationSettings);
          setQuery({
            page: paginationSettings?.current,
            limit: paginationSettings?.pageSize,
          });
        }}
        scroll={{ x: true, y: "65vh" }}
        loading={loadingList}
        showSizeChanger={false}
      />
    </div>
  );
}