import { Button, Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { apiInstance } from "../../api";
import styles from "./index.module.scss";
import axios from "axios";

export default function LoginPage({ isLogin = true }) {
  const navigation = useNavigate();
  const handleSubmitForm = async (values) => {
    if (isLogin) {
      const {
        data: { success, accessToken, message },
      } = await axios.post("http://localhost:5001/auth/login", values);
      if (success) {
        localStorage.setItem("access_token", accessToken);
        apiInstance.defaults.headers.Authorization = accessToken;
        navigation("/");
      } else {
      }
    } else {
      const {
        data: { success, message },
      } = await apiInstance.post("auth/register", values);
      if (success) {
        navigation("/");
      }
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
    <div className={styles.container}>
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
  );
}
