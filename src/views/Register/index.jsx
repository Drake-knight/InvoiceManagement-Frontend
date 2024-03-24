/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
	Form,
	Input,
	Select,
	Row,
	Col,
	Button,
	Modal,
	Result,
	Divider,
	Typography,
	Layout,
} from "antd";
import { SmileOutlined, MailOutlined, KeyOutlined, FormOutlined } from "@ant-design/icons";

import axios from "../../utils/axios";
import { useHistory } from "react-router-dom";

const { Content } = Layout;

const RegistrationForm = () => {
	const [form] = Form.useForm();
	const history = useHistory();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onFinish = async (values) => {
		try {
			await form.validateFields();
			setIsSubmitting(true);
			const { data } = await axios.post("/register", values);
			setIsSubmitting(false);
			setVerificationModalVisible(true);
			const modal = Modal.success({
				content: (
					<Result
						icon={<SmileOutlined />}
						title="Yay!"
						subTitle="You are successfully registered. "
						extra={`Thank you for registering.`}
						style={{ overflowY: "hidden" }}
					/>
				),
				centered: true,
				maskClosable: false,
				keyboard: false,
				okButtonProps: {
					onClick: () => {
						history.push("/invoice");
						modal.destroy();
					},
				},
				okText: "Done!",
			});
		} catch (error) {
			setIsSubmitting(false);
			console.error("Error", error.message);
		}
	};

	return (
		<>
			<Content className="container">
				<div className="form">
					<Divider>
						<Typography.Title level={3} justify={"center"} style={{ margin: "unset" }}>
							<FormOutlined /> Registration Form
						</Typography.Title>
					</Divider>
					<Form
						form={form}
						name="register"
						onFinish={onFinish}
						size="large"
						layout="vertical"
						scrollToFirstError>
						<Row gutter={12}>
							<Col xs={24} md={12}>
								<Form.Item
									name="Name"
									label={
										<span>
											<SmileOutlined /> Name{" "}
										</span>
									}
									rules={[
										{
											required: true,
											message: "Please enter your name",
										},
										{
											validator: async (_, value) => {
												if (!value || !/\s/.test(value.trim())) {
													return true;
												} else {
													throw new Error("Please enter a single word");
												}
											},
										},
									]}>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name="email"
									label={
										<span>
											<MailOutlined /> Email{" "}
										</span>
									}
									rules={[
										{
											type: "email",
											message: "The input is not valid Email!",
										},
										{
											required: true,
											message: "Please input your Email!",
										},
									]}>
									<Input />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={12}>
							<Col xs={24} md={12}>
								<Form.Item
									name="password"
									rules={[
										{
											required: true,
											message: "Please input your password.",
										},
										{
											min: 6,
											message: "Please input at least 6 characters.",
										},
									]}
									label={
										<span>
											<KeyOutlined /> Create Password
										</span>
									}>
									<Input.Password />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									dependencies={["password"]}
									name="confirmPassword"
									hasFeedback
									validateTrigger="onChange"
									rules={[
										{
											required: true,
											message: "Please confirm your password.",
										},
										({ getFieldValue }) => ({
											validator(_rule, value) {
												if (!value || getFieldValue("password") === value) {
													return Promise.resolve();
												}
												return Promise.reject(
													"Please enter the same password"
												);
											},
										}),
									]}
									label={
										<span>
											<KeyOutlined /> Confirm Password
										</span>
									}>
									<Input.Password />
								</Form.Item>
							</Col>
						</Row>

						<Divider />

						<Row gutter={12} justify="space-between" align="top">
							<Col flex="auto">
								<div>
									<Typography.Text type="secondary" strong>
										Already registered
									</Typography.Text>
								</div>
								<Link to="/login">Log In</Link>
							</Col>

							<Col span={{ lg: 8, xs: 12 }}>
								<Form.Item>
									<Button
										style={{ width: "100%" }}
										type="primary"
										size={"large"}
										htmlType="submit"
										loading={isSubmitting}>
										Submit
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

export default RegistrationForm;
