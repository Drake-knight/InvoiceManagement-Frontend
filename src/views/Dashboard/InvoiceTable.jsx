import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, DatePicker } from "antd";

const InvoiceTable = ({ data, handleDelete, handleUpdateInvoice }) => {
	const [visible, setVisible] = useState(false);
	const [lineItemsModalVisible, setLineItemsModalVisible] = useState(false);
	const [lineItems, setLineItems] = useState([]);
	const [editedInvoice, setEditedInvoice] = useState({});
	const [form] = Form.useForm();

	const columns = [
		{ title: "Invoice ID", dataIndex: "invoice_id" },
		{ title: "Date", dataIndex: "invoice_date" },
		{ title: "Customer Name", dataIndex: "customer_name" },
		{ title: "Customer Email", dataIndex: "customer_email" },
		{ title: "Customer Phone", dataIndex: "customer_phone" },
		{
			title: "Actions",
			render: (_, record) => (
				<Space>
					<Button onClick={() => handleDeleteInvoice(record)}>Delete Invoice</Button>
					<Button onClick={() => handleEditInvoice(record)}>Edit Invoice</Button>
					<Button onClick={() => handleViewLineItems(record)}>View Line Items</Button>
				</Space>
			),
		},
	];

	const lineItemsColumns = [
		{ title: "Item Name", dataIndex: "item_name" },
		{ title: "Quantity", dataIndex: "quantity" },
		{ title: "Price", dataIndex: "price" },
	];

	const handleDeleteInvoice = (record) => {
		handleDelete(record.invoice_id);
	};

	const handleEditInvoice = (record) => {
		setEditedInvoice(record);
		setVisible(true);
	};

	const handleViewLineItems = (record) => {
		setLineItems(record.line_items);
		setLineItemsModalVisible(true);
	};

	const handleEditFormSubmit = () => {
		form.validateFields().then((values) => {
			const updatedInvoice = { ...editedInvoice, ...values };
			if (updatedInvoice.date) {
				updatedInvoice.date = new Date(updatedInvoice.date).toISOString().split("T")[0];
			}
			handleUpdateInvoice(updatedInvoice);
			setVisible(false);
		});
	};

	return (
		<div>
			<Table columns={columns} dataSource={data} rowKey="invoice_id" />
			<Modal
				title="Edit Invoice"
				visible={visible}
				onCancel={() => setVisible(false)}
				onOk={handleEditFormSubmit}>
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
							{
								pattern: /^[0-9]{10}$/,
								message: "Please enter a 10-digit phone number",
							},
						]}>
						<Input />
					</Form.Item>
					<Form.Item
						name="date"
						label="Invoice Date"
						rules={[{ required: true, message: "Please select invoice date" }]}>
						<DatePicker style={{ width: "100%" }} />
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title="Line Items"
				visible={lineItemsModalVisible}
				onCancel={() => setLineItemsModalVisible(false)}
				footer={[
					<Button key="close" onClick={() => setLineItemsModalVisible(false)}>
						Close
					</Button>,
				]}>
				<Table
					columns={lineItemsColumns}
					dataSource={lineItems}
					pagination={false}
					rowKey={(record, index) => index}
				/>
			</Modal>
		</div>
	);
};

export default InvoiceTable;
