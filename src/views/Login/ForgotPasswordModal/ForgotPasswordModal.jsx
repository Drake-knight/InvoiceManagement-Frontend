import React, { useState } from "react";
import { Button, Input, Form, Modal, Row, Space, Steps, Typography, Result } from "antd";
import { MailOutlined, KeyOutlined, CheckCircleOutlined, SmileOutlined } from "@ant-design/icons";
import axios from "../../../utils/axios";

const { Step } = Steps;

const ForgotPasswordModal = ({ visible, setVisible }) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState({ onEmailFinish: false, onPasswordFinish: false });
	const [email, setEmail] = useState("");

	const onEmailFinish = async (formValues) => {
		try {
			setIsLoading((oldValue) => {
				return { ...oldValue, onEmailFinish: true };
			});
			const { data } = await axios.post(`/pw-reset-mail`, formValues);
			console.log(data);
			setIsLoading((oldValue) => {
				return { ...oldValue, onEmailFinish: false };
			});
			setEmail(data.email);
			console.log(data.email);
			setCurrentStep(1);
			console.log("Email sent successfully");
			console.log(currentStep);
		} catch (error) {
			setIsLoading((oldValue) => {
				return { ...oldValue, onEmailFinish: false };
			});
			console.log(error);
		}
	};

	const onPasswordFinish = async (values) => {
		try {
			setIsLoading((oldValue) => {
				return { ...oldValue, onPasswordFinish: true };
			});
			await axios.post(`/reset-password`, {
				...values,
				email,
			});
			setIsLoading((oldValue) => {
				return { ...oldValue, onPasswordFinish: false };
			});
			setCurrentStep(2);
		} catch (error) {
			setIsLoading((oldValue) => {
				return { ...oldValue, onPasswordFinish: false };
			});
			console.log(error);
		}
	};
	return (
		<Modal visible={visible} closable={false} footer={null} destroyOnClose={true}>
			<Steps current={currentStep}>
				<Step icon={<MailOutlined />} />
				<Step icon={<KeyOutlined />} />
				<Step icon={<CheckCircleOutlined />} />
			</Steps>
			{currentStep === 0 ? (
				<Form
					name="forgotPasswordModal"
					onFinish={onEmailFinish}
					preserve={false}
					layout="vertical"
					validateTrigger="onSubmit">
					<Form.Item
						name="email"
						label="Enter the corresponding Email"
						rules={[
							{ required: true, message: "Please enter your Email" },
							{ type: "email", message: "The input is not a valid Email" },
						]}>
						<Input />
					</Form.Item>
					<Row justify="end">
						<Space>
							<Button onClick={() => setVisible(false)}>Cancel</Button>
							<Form.Item style={{ marginBottom: "0" }}>
								<Button
									htmlType="submit"
									type="primary"
									loading={isLoading.onEmailFinish}>
									Send Password Reset Code
								</Button>
							</Form.Item>
						</Space>
					</Row>
				</Form>
			) : currentStep === 1 ? (
				<Form
					name="forgotPasswordModal"
					onFinish={onPasswordFinish}
					preserve={false}
					layout="vertical"
					validateTrigger="onSubmit">
					<Typography.Text strong>Check your Mail for reset code.</Typography.Text>
					<Form.Item
						label="Insert the reset code here"
						name="resetCode"
						rules={[{ required: true, message: "Please input the required code." }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label="Your new password"
						name="newPassword"
						rules={[{ required: true, message: "Please input your new password" }]}>
						<Input.Password />
					</Form.Item>
					<Row justify="end">
						<Space>
							<Button
								onClick={() => {
									setCurrentStep(0);
									setVisible(false);
								}}>
								Cancel
							</Button>
							<Form.Item style={{ marginBottom: "0" }}>
								<Button
									htmlType="submit"
									type="primary"
									loading={isLoading.onPasswordFinish}>
									Reset My Password
								</Button>
							</Form.Item>
						</Space>
					</Row>
				</Form>
			) : (
				<Result
					icon={<SmileOutlined />}
					title="Password reset successful!"
					extra={
						<Button type="primary" onClick={() => setVisible(false)}>
							Close
						</Button>
					}
				/>
			)}
		</Modal>
	);
};

export default ForgotPasswordModal;
