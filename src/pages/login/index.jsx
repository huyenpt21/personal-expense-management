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
            console.log(status, "Login successfully!", data);
            localStorage.setItem("access_token", data?.accessToken);
            apiInstance.defaults.headers.Authorization = data?.accessToken;
            navigation("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      apiInstance
        .post("auth/register", values)
        .then(({ status }) => {
          if (status === 200) {
            openNotification(api, "Register successfully!");
            navigation("/");
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
      <div className={styles.container}>
        {contextHolder}
        <div className={styles.main__section}>
          <div className={styles.content}>
            <h1 className={styles.header}>{isLogin ? "Login" : "Register"}</h1>
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
          <div className={styles.image}>
            <img
              src="https://colorlib.com/etc/regform/colorlib-regform-7/images/signup-image.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
