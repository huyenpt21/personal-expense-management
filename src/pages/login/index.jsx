import { Button, Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

export default function LoginPage({ isLogin = true }) {
  const navigattion = useNavigate();
  const handleSubmitForm = (values) => {
    console.log(values);
    localStorage.setItem("access_token", "token ne");
    navigattion("/");
  };

  const handleNavigateLogin = () => {
    if (isLogin) {
      navigattion("/register");
    } else {
      navigattion("/");
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
