import { Button, Col, Form, Image, Input, Row, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiInstance } from "../../api";
import dayjs from "dayjs";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

export default function UploadInvoice() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { idInvoice } = useParams();
  const [imageUrl, setImageUrl] = useState();
  const [imageId, setImageId] = useState(null);

  useEffect(() => {
    if (idInvoice) {
      apiInstance.post("/invoice/get", { _id: idInvoice }).then(({ data }) => {
        if (data) {
          data.createdAt = dayjs(data?.createdAt).format("DD/MM/YYYY");
          data.updatedAt = dayjs(data?.updatedAt).format("DD/MM/YYYY");
          form.setFieldsValue(data);
          setImageUrl(`data:image/jpeg;base64,${data?.base64_image}`);
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
    apiInstance
      .post("/invoice/delete", {
        _id: imageId,
      })
      .then((res) => {
        const { status } = res;
        if (status === 200) {
          setImageUrl(null);
          setImageId(null);
        }
      });
  };

  const handleExtractInvoice = () => {
    apiInstance
      .post("invoice/extract", {
        _id: imageId || idInvoice,
      })
      .then(({ data }) => {
        form.setFieldsValue(data);
      });
  };

  const handleAddToExpense = () => {
    apiInstance
      .post("invoice/add-to-expense", {
        _id: imageId || idInvoice,
      })
      .then((res) => {
        console.log(res);
      });
  };

  const handleDeleteInvoice = () => {
    apiInstance.post("invoice/delete", {
      _id: imageId || idInvoice,
    });
  };

  return (
    <>
      <div className="container__upload">
        <Row>
          <Col span={14}>
            <Row className="upload__button">
              <Button
                type="primary"
                onClick={handleExtractInvoice}
                disabled={!!form.getFieldValue("isExtracted")}
              >
                Extract
              </Button>
              <Button danger type="primary" onClick={handleDeleteImage}>
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
            {imageUrl && <Image width="40vw" src={imageUrl} />}
          </Col>
          <Col span={10}>
            <Row style={{ marginBottom: "12px" }}>
              <h2>Invoice Information</h2>
            </Row>
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
                  Is expensed: {form.getFieldValue("isExpensed") ? "Yes" : "No"}
                </Col>
                <Col span={12}>
                  Is extracted:{" "}
                  {form.getFieldValue("isExtracted") ? "Yes" : "No"}
                </Col>
              </Row>
            </Form>

            <Row
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "24px",
              }}
            >
              <Col>
                <Button type="primary">Update</Button>
              </Col>
              <Col>
                <Button danger type="primary" onClick={handleDeleteInvoice}>
                  Delete Invoice
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={handleAddToExpense}
                  // disabled={
                  //   form.getFieldValue("isExpensed") ||
                  //   !form.getFieldValue("isExtracted")
                  // }
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
          </Col>
        </Row>
      </div>
    </>
  );
}
