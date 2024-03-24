import React, { useState } from "react";
import { Modal, Form, Input, Button, DatePicker, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import getCookieToken from "../../utils/getCookieToken";

const AddInvoiceModal = ({ visible, onCreate, onCancel }) => {
	const [form] = Form.useForm();
	const [lineItems, setLineItems] = useState([{ item_name: "", quantity: "", price: "" }]);

	const userInfo = getCookieToken();

	const handleCreate = () => {
		form.validateFields().then((values) => {
			onCreate({ ...values, userId: userInfo.userId });
			form.resetFields();
			setLineItems([]);
		});
	};

	return (
		<Modal
			visible={visible}
			title="Add New Invoice"
			okText="Add"
			cancelText="Cancel"
			onCancel={onCancel}
			onOk={handleCreate}
			destroyOnClose={true}>
			<Form form={form} layout="vertical">
				<Form.Item
					name="customer_name"
					label="Customer Name"
					rules={[{ required: true, message: "Please enter customer name" }]}>
					<Input />
				</Form.Item>
				<Form.Item
					name="customer_email"
					label="Customer Email"
					rules={[
						{ required: true, message: "Please enter customer email" },
						{ type: "email", message: "Please enter a valid email address" },
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					name="customer_phone"
					label="Customer Phone"
					rules={[
						{ required: true, message: "Please enter customer phone" },
						{ pattern: /^[0-9]{10}$/, message: "Please enter a 10-digit phone number" },
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					name="date"
					label="Invoice Date"
					rules={[{ required: true, message: "Please select invoice date" }]}>
					<DatePicker style={{ width: "100%" }} />
				</Form.Item>
				<Form.List name="line_items">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, fieldKey, ...restField }, index) => (
								<Space
									key={key}
									style={{ display: "flex", marginBottom: 8 }}
									align="baseline">
									<Form.Item
										{...restField}
										name={[name, "item_name"]}
										fieldKey={[fieldKey, "item_name"]}
										rules={[{ required: true, message: "Missing item name" }]}>
										<Input placeholder="Item Name" />
									</Form.Item>
									<Form.Item
										{...restField}
										name={[name, "quantity"]}
										fieldKey={[fieldKey, "quantity"]}
										rules={[{ required: true, message: "Missing quantity" }]}>
										<Input placeholder="Quantity" style={{ width: 100 }} />
									</Form.Item>
									<Form.Item
										{...restField}
										name={[name, "price"]}
										fieldKey={[fieldKey, "price"]}
										rules={[{ required: true, message: "Missing price" }]}>
										<Input placeholder="Price (₹)" style={{ width: 100 }} />
									</Form.Item>
									<MinusCircleOutlined onClick={() => remove(name)} />
								</Space>
							))}
							<Form.Item>
								<Button
									type="dashed"
									onClick={() => add()}
									block
									icon={<PlusOutlined />}>
									Add Line Item
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Form>
		</Modal>
	);
};

export default AddInvoiceModal;
