import { Button, Form, Input, notification } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { apiInstance } from "../../api";
import { openNotification } from "../../helper";
import styles from "./index.module.scss";

export default function LoginPage({ isLogin = true }) {
  const [api, contextHolder] = notification.useNotification();

  const navigation = useNavigate();
  const handleSubmitForm = (values) => {
    if (isLogin) {
      apiInstance
        .post("http://localhost:5001/auth/login", values)
        .then(({ status, data }) => {
          openNotification(api, "Login successfully!");
          if (status === 200) {
            setTimeout(() => {
              localStorage.setItem("access_token", data?.accessToken);
              apiInstance.defaults.headers.Authorization = data?.accessToken;
              navigation("/");
            }, 700);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      apiInstance
        .post("auth/register", values)
        .then(({ status }) => {
          openNotification(api, "Register successfully!");
          if (status === 200) {
            setTimeout(() => {
              navigation("/");
            }, 700);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleNavigateLogin = () => {
    if (isLogin) {
      navigation("/register");
    } else {
      navigation("/");
    }
  };
  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.main__section}>
          <h1 className={styles.title}>Business Expense Management</h1>
          <div className={styles.content}>
            <h2 className={styles.header}>{isLogin ? "Login" : "Register"}</h2>
            <Form layout="vertical" onFinish={handleSubmitForm}>
              <Form.Item
                label="Username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
                name="username"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
                name="password"
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.btn}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <p className={styles.login__link} onClick={handleNavigateLogin}>
              {isLogin ? "Do not have an account?" : "Already have an account?"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
