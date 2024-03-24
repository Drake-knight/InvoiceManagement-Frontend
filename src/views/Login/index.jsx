import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Layout, Input, Button, Row, Col, Grid, Card, Typography, Divider } from "antd";
import { FormOutlined } from "@ant-design/icons";

import axios from "../../utils/axios";

import ForgotLoginModal from "./ForgotPasswordModal/ForgotPasswordModal";

const { useBreakpoint } = Grid;
const { Content } = Layout;

const Login = () => {
	const [forgotPasswordModalVisbility, setForgotPasswordModalVisbility] = useState(false);
	const screen = useBreakpoint();
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(false);

	const onFinish = async (values) => {
		try {
			setIsLoading(true);
			const { data } = await axios.post("/login", values);
			localStorage.setItem("jwtToken", data.token);
			localStorage.setItem("user_id", data.user_id);
			history.push("/invoice");
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.error(error);
		}
	};

	return (
		<>
			<Content className="container">
				<ForgotLoginModal
					visible={forgotPasswordModalVisbility}
					setVisible={setForgotPasswordModalVisbility}
					userType="mentor"
				/>
				<Row justify="center"></Row>
				<div className="form">
					<Divider>
						<Typography.Title level={3} justify={"center"} style={{ margin: "unset" }}>
							<FormOutlined />
							Login
						</Typography.Title>
					</Divider>

					<Form size="large" layout="vertical" name="Login" onFinish={onFinish}>
						<Form.Item
							label="E-Mail"
							name="email"
							rules={[
								{
									required: true,
									message: "Please input your E-Mail!",
								},
							]}>
							<Input />
						</Form.Item>

						<Form.Item
							label="Password"
							name="password"
							rules={[
								{
									required: true,
									message: "Please input your password!",
								},
							]}
							extra={
								<Button
									onClick={() => setForgotPasswordModalVisbility(true)}
									type="link"
									style={{ paddingLeft: "0" }}
									size="small">
									Forgot Password?
								</Button>
							}>
							<Input.Password />
						</Form.Item>

						<Row justify="space-between" align="top">
							<Col flex="auto">
								<div>
									<Typography.Text type="secondary" strong>
										New here?
									</Typography.Text>
								</div>
								<Link to="/register">Register here</Link>
							</Col>
							<Col span={8} style={{ textAlign: "right" }}>
								<Form.Item style={{ marginBottom: "0px" }}>
									<Button
										type="primary"
										size="large"
										htmlType="submit"
										loading={isLoading}>
										Log In
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</div>
			</Content>
		</>
	);
};

export default Login;
