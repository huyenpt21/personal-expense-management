import { Button, Row, Table, Tooltip } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { apiInstance } from "../../api";
import { COLUMN_INVOICE } from "../../helper";
import dayjs from "dayjs";

export default function ListInvoices() {
  const navigate = useNavigate();
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const [record, setRecord] = useState([]);
  const [columnsRender, setColumnsRender] = useState([]);
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loadingList, setLoadingList] = useState(false);
  const handleRenderListInvoice = useCallback(
    (listInvoices) => {
      const listInvoicesConverted = listInvoices.map((el) => ({
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
                  navigate(`/upload-invoice/${el._id}`);
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
            {!el?.isExtracted && (
              <Tooltip title="Extract">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={(idInvoice) => {
                    apiInstance
                      .post("invoice/extract", {
                        _id: idInvoice,
                      })
                      .then(({ status, data }) => {
                        if (status === 200) {
                          handleRenderListInvoice(data);
                        }
                      });
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
            )}
          </div>
        ),
      }));
      setRecord(listInvoicesConverted);
    },
    [navigate]
  );

  useEffect(() => {
    if (type === "detail") {
      setLoadingList(true);
      apiInstance
        .get("/expense/get-invoice-in-expense", {
          params: {
            month: Number(searchParams.get("month")) ?? dayjs().month(),
            year: Number(searchParams.get("year")) ?? dayjs().year(),
          },
        })
        .then(({ status, data }) => {
          setLoadingList(false);
          if (status === 200) {
            handleRenderListInvoice(data);
          }
        });
    } else if (type === "detail-from-seller") {
      setLoadingList(true);
      apiInstance
        .post("/seller/get", {
          _id: localStorage.getItem("invoiceId"),
        })
        .then(({ status, data }) => {
          setLoadingList(false);
          if (status === 200) {
            handleRenderListInvoice(data);
          }
        })
        .catch(() => {
          setLoadingList(false);
        });
    }
  }, [type, searchParams, handleRenderListInvoice]);

  useEffect(() => {
    if (!type) {
      setLoadingList(true);
      apiInstance
        .get("invoice/get-all", { params: query })
        .then(({ status, data: { dataCopy: listInvoices, totalPage } }) => {
          setLoadingList(false);
          if (status === 200) {
            handleRenderListInvoice(listInvoices);
            setPagination((prev) => ({ ...prev, total: totalPage * 10 }));
          }
        });
    }
  }, [handleRenderListInvoice, query, type]);

  useEffect(() => {
    const column = COLUMN_INVOICE.map((el) => {
      switch (el.key) {
        case "seller":
          el.width = 250;
          break;
        case "tax_code":
          el.width = 130;
          break;
        case "isExpensed":
          el.width = 150;
          break;
        case "isExtracted":
          el.width = 150;
          break;
        case "invoice_number":
          el.width = 100;
          break;
        case "action":
          el.width = 80;
          break;
        case "address":
          el.width = 400;
          break;
        case "total":
          el.width = 100;
          break;
        default:
      }
      return {
        ...el,
        render: (data) => {
          if (typeof data === "boolean") {
            return data ? "Yes" : "No";
          }
          return data;
        },
      };
    });
    setColumnsRender(column);
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
