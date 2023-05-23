import { Button, Col, Form, Image, Input, Row, Upload } from "antd";
import React, { useState } from "react";
import { apiInstance } from "../../api";
import { useNavigate } from "react-router-dom";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

export default function UploadInvoice() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState();
  const [imageId, setImageId] = useState(null);
  const handleChange = (info) => {
    getBase64(info.file.originFileObj, async (url) => {
      setImageUrl(url);
      const response = await apiInstance.post("invoice/upload", {
        base64_image: url,
      });
      if (response?.data && response?.data?._id) {
        setImageId(response.data._id);
      }
    });
  };

  const handleDeleteImage = () => {
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

  const handleExtrctInvoice = () => {
    apiInstance
      .post("/invoice/extract", {
        _id: imageId,
      })
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <div className="container">
      <Row>
        <Col span={12}>
          <Row className="upload__button">
            <Button
              type="primary"
              onClick={handleExtrctInvoice}
              disabled={!imageId}
            >
              Extract
            </Button>
            <Button
              danger
              type="primary"
              onClick={handleDeleteImage}
              disabled={!imageId}
            >
              Delete
            </Button>
          </Row>
          {!imageUrl && (
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              onChange={handleChange}
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
          {imageUrl && <Image width="30vw" src={imageUrl} />}
        </Col>
        <Col span={12}>
          <Row style={{ marginBottom: "12px" }}>
            <h2>Invoice Information</h2>
          </Row>
          <Form>
            <Form.Item>
              <Input />
            </Form.Item>
            <Form.Item>
              <Input />
            </Form.Item>
            <Form.Item>
              <Input />
            </Form.Item>
            <Form.Item>
              <Input />
            </Form.Item>
          </Form>
          <Row
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "12px",
            }}
          >
            <Col>
              <Button type="primary">Update</Button>
            </Col>
            <Col>
              <Button type="primary">Add to Expense</Button>
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
  );
}
