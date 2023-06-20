import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Row,
  Spin,
  Tag,
  Upload,
  notification,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiInstance } from "../../api";
import { openNotification } from "../../helper";
import ConfirmModal from "../confirmModal";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

export default function UploadInvoice() {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { idInvoice } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [formValue, setFormValue] = useState({
    isExpensed: false,
    isExtracted: false,
  });

  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [isShowModalConfirmDeleteInvoice, setIsShowModalConfirmDeleteInvoice] =
    useState(false);

  useEffect(() => {
    if (idInvoice) {
      setLoadingList(true);
      apiInstance.post("/invoice/get", { _id: idInvoice }).then(({ data }) => {
        setLoadingList(false);
        if (data) {
          data.createdAt = dayjs(data?.createdAt).format("DD/MM/YYYY");
          data.updatedAt = dayjs(data?.updatedAt).format("DD/MM/YYYY");
          form.setFieldsValue(data);
          setFormValue({
            ...data,
            isExpensed: data?.isExpensed,
            isExtracted: data?.isExtracted,
          });
          setImageUrl(`data:image/jpeg;base64,${data?.base64_image}`);
          setImageId(data._id);
        }
      });
    }
  }, [form, idInvoice]);
  const handleUploadImage = (info) => {
    getBase64(info.file.originFileObj, async (url) => {
      const convertImage = url.replace("data:image/jpeg;base64,", "");
      setImageUrl(url);
      const response = await apiInstance.post("invoice/upload", {
        base64_image: convertImage,
      });
      if (response?.data && response?.data?._id) {
        setImageId(response.data._id);
      }
    });
  };

  const handleDeleteImage = () => {
    setImageUrl(null);
    setImageId(null);
    setIsShowModalConfirm(false);
    apiInstance
      .post("/invoice/delete", {
        _id: imageId,
      })
      .then((res) => {
        const { status } = res;
        if (status === 200) {
          setImageUrl(null);
          setImageId(null);
          openNotification(api, "Delete image successfully!");
        }
      });
  };

  const handleExtractInvoice = () => {
    setLoading(true);
    apiInstance
      .post("invoice/extract", {
        _id: imageId || idInvoice,
      })
      .then(({ data, status }) => {
        if (status === 200) {
          setLoading(false);
          if (data?.isExtracted) {
            openNotification(api, "Extract invoice successfully!");
            setFormValue({ isExtracted: true, isExpensed: false });
            form.setFieldsValue(data);
          } else {
            openNotification(api, "Extract invoice faild!", "error");
          }
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleAddToExpense = () => {
    apiInstance
      .post("invoice/add-to-expense", {
        _id: imageId || idInvoice,
      })
      .then(({ status }) => {
        if (status === 200) {
          setLoading(false);
          setFormValue({ isExtracted: true, isExpensed: true });
          openNotification(api, "Add invoice to expense successfully!");
        }
      });
  };

  const handleDeleteInvoice = () => {
    apiInstance
      .post("invoice/delete", {
        _id: imageId || idInvoice,
      })
      .then(({ status }) => {
        if (status === 200) {
          setIsShowModalConfirmDeleteInvoice(false);
          openNotification(api, "Delete invoice successfully!");
          navigate("/upload-invoice");
          form.resetFields();
        }
      });
  };

  const handleUpdateInvoice = () => {
    const updatedFormValue = form.getFieldsValue();
    apiInstance
      .post("/invoice/update", { ...formValue, ...updatedFormValue })
      .then(({ status }) => {
        if (status === 200) {
          openNotification(api, "Update invoice successfully!");
        }
      })
      .catch((error) => {
        openNotification(api, "Update invoice faild!", "error");
      });
  };
  return (
    <>
      {contextHolder}
      <div className="container__upload">
        <Row gutter={120}>
          <Col span={12}>
            <Row className="upload__button">
              <Button
                type="primary"
                onClick={handleExtractInvoice}
                disabled={
                  !!form.getFieldValue("isExtracted") || !imageId || loading
                }
              >
                Extract
              </Button>
              <Button
                danger
                type="primary"
                onClick={() => {
                  setIsShowModalConfirm(true);
                }}
                disabled={!imageUrl || loading}
              >
                Delete Image
              </Button>
            </Row>
            {!imageUrl && (
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                onChange={handleUploadImage}
              >
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload +
                </div>
              </Upload>
            )}
            {!loading && imageUrl && <Image width="40vw" src={imageUrl} />}
            {loading && (
              <div
                style={{
                  width: "200px",
                  height: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin />
              </div>
            )}
          </Col>
          <Col span={12}>
            <Row style={{ marginBottom: "12px" }}>
              <h2>Invoice Information</h2>
            </Row>
            {loadingList && (
              <div
                style={{
                  width: "200px",
                  height: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin />
              </div>
            )}
            {!loadingList && (
              <>
                <Form form={form} layout="vertical">
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item name="invoice_number" label="Invoice Number">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="serial" label="Serial">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item name="date" label="Date">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="tax_code" label="Tax code">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item name="seller" label="Seller">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="address" label="Address">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item>
                        <Tag
                          color={
                            form.getFieldValue("isExpensed") ? "green" : "red"
                          }
                        >
                          Expensed
                        </Tag>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item>
                        <Tag
                          color={
                            form.getFieldValue("isExtracted") ? "green" : "red"
                          }
                        >
                          Extracted
                        </Tag>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.List name="table">
                    {(fields, { add, remove }, { errors }) => {
                      return (
                        <>
                          {fields.map(({ key, name }, index) => (
                            <Row key={key} gutter={12}>
                              <Col span={6}>
                                <Form.Item
                                  key={key}
                                  name={[name, "amount"]}
                                  label={index === 0 ? "Amount" : null}
                                >
                                  <Input />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item
                                  key={key}
                                  name={[name, "tax_rate"]}
                                  label={index === 0 ? "Tax rate" : null}
                                >
                                  <Input />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  key={key}
                                  name={[name, "description"]}
                                  label={index === 0 ? "Description" : null}
                                >
                                  <Input />
                                </Form.Item>
                              </Col>
                              <Col
                                span={2}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <svg
                                  width="22px"
                                  height="22px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  onClick={() => remove(name)}
                                >
                                  <path
                                    d="M10 12V17"
                                    stroke="#000000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M14 12V17"
                                    stroke="#000000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M4 7H20"
                                    stroke="#000000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                                    stroke="#000000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                                    stroke="#000000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </Col>
                            </Row>
                          ))}
                          <Col span={24}>
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                style={{ width: "100%" }}
                              >
                                Add row
                              </Button>
                              <Form.ErrorList errors={errors} />
                            </Form.Item>
                          </Col>
                        </>
                      );
                    }}
                  </Form.List>
                </Form>
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: "24px",
                  }}
                >
                  <Col>
                    <Button
                      type="primary"
                      disabled={
                        !form.getFieldValue("_id") || formValue?.isExpensed
                      }
                      onClick={handleUpdateInvoice}
                    >
                      Update
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      danger
                      type="primary"
                      onClick={() => {
                        setIsShowModalConfirmDeleteInvoice(true);
                      }}
                      disabled={!form.getFieldValue("isExtracted")}
                    >
                      Delete Invoice
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      onClick={handleAddToExpense}
                      disabled={
                        formValue?.isExpensed || !formValue?.isExtracted
                      }
                    >
                      Add to Expense
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      Back Home
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </div>
      {isShowModalConfirm && (
        <ConfirmModal
          open={isShowModalConfirm}
          onOk={handleDeleteImage}
          onCancel={() => setIsShowModalConfirm(false)}
        />
      )}
      {isShowModalConfirmDeleteInvoice && (
        <ConfirmModal
          open={isShowModalConfirmDeleteInvoice}
          onOk={handleDeleteInvoice}
          onCancel={() => setIsShowModalConfirmDeleteInvoice(false)}
        />
      )}
    </>
  );
}
