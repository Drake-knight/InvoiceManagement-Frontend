import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, DatePicker } from "antd";
import moment from "moment";

const InvoiceTable = ({
	data,
	handleDelete,
	handleUpdateInvoice,
	handleRemoveLine,
	handleAddLine,
	handleUpdateLine,
}) => {
	const [visible, setVisible] = useState(false);
	const [lineItemsModalVisible, setLineItemsModalVisible] = useState(false);
	const [addItemModalVisible, setAddItemModalVisible] = useState(false);
	const [editItemModalVisible, setEditItemModalVisible] = useState(false);
	const [lineItems, setLineItems] = useState([]);
	const [editedInvoice, setEditedInvoice] = useState({});
	const [editedLineItem, setEditedLineItem] = useState(null);
	const [form] = Form.useForm();
	const [addItemForm] = Form.useForm();
	const [editItemForm] = Form.useForm();

	// Add a new state variable for invoiceId
	const [invoiceId, setInvoiceId] = useState(null);

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
		{
			title: "Actions",
			render: (_, record) => (
				<Space>
					<Button onClick={() => handleEditLineItem(record)}>Edit</Button>
					<Button onClick={() => handleDeleteLineItem(record)}>Delete</Button>
				</Space>
			),
		},
	];

	const handleDeleteInvoice = (record) => {
		handleDelete(record.invoice_id);
	};

	const handleEditInvoice = (record) => {
		form.setFieldsValue({
			customer_name: record.customer_name,
			customer_email: record.customer_email,
			customer_phone: record.customer_phone,
			date: moment(record.invoice_date),
		});
		setEditedInvoice(record);
		setVisible(true);
	};

	const handleViewLineItems = (record) => {
		setLineItems(record.line_items);
		setInvoiceId(record.invoice_id);
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

	const handleEditLineItem = (record) => {
		editItemForm.setFieldsValue({
			item_name: record.item_name,
			price: record.price,
			quantity: record.quantity,
		});
		setEditedLineItem(record);
		setEditItemModalVisible(true);
	};

	const handleEditItemFormSubmit = () => {
		editItemForm.validateFields().then((values) => {
			let updatedItem = null;
			const updatedLineItems = lineItems.map((item) => {
				if (item === editedLineItem) {
					updatedItem = {
						...item,
						item_name: values.item_name,
						price: values.price,
						quantity: values.quantity,
					};
					return updatedItem;
				}
				return item;
			});
			setLineItems(updatedLineItems);

			if (updatedItem) {
				handleUpdateLine(updatedItem, editedLineItem.line_item_id);
			}
			setEditItemModalVisible(false);
			editItemForm.resetFields();
			setEditedLineItem(null);
		});
	};
	const handleDeleteLineItem = (record) => {
		const updatedLineItems = lineItems.filter((item) => item !== record);
		handleRemoveLine(record.line_item_id);
		setLineItems(updatedLineItems);
	};

	const handleAddLineItem = () => {
		setAddItemModalVisible(true);
	};

	const handleAddItemFormSubmit = () => {
		addItemForm.validateFields().then((values) => {
			const newItem = {
				invoice_id: invoiceId,
				item_name: values.item_name,
				price: values.price,
				quantity: values.quantity,
			};
			setLineItems([...lineItems, newItem]);
			setAddItemModalVisible(false);
			handleAddLine(newItem);
			addItemForm.resetFields();
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
					<Button key="add" type="primary" onClick={handleAddLineItem}>
						Add Line Item
					</Button>,
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
			<Modal
				title="Add Line Item"
				visible={addItemModalVisible}
				onCancel={() => setAddItemModalVisible(false)}
				onOk={handleAddItemFormSubmit}>
				<Form form={addItemForm} layout="vertical">
					<Form.Item
						name="item_name"
						label="Item Name"
						rules={[{ required: true, message: "Please enter item name" }]}>
						<Input />
					</Form.Item>
					<Form.Item
						name="price"
						label="Price(₹)"
						rules={[
							{ type: "number", message: "Price must be a number" },
							{ required: true, message: "Please enter item price" },
						]}>
						<Input type="number" />
					</Form.Item>
					<Form.Item
						name="quantity"
						label="Quantity"
						rules={[
							{ type: "number", message: "Quantity must be a number" },
							{ required: true, message: "Please enter item quantity" },
						]}>
						<Input type="number" />
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title="Edit Line Item"
				visible={editItemModalVisible}
				onCancel={() => setEditItemModalVisible(false)}
				onOk={handleEditItemFormSubmit}>
				<Form form={editItemForm} layout="vertical">
					{" "}
					<Form.Item
						name="item_name"
						label="Item Name"
						rules={[{ required: true, message: "Please enter item name" }]}>
						<Input />
					</Form.Item>
					<Form.Item
						name="price"
						label="Price"
						rules={[
							{ type: "number", message: "Price must be a number" },
							{ required: true, message: "Please enter item price" },
						]}>
						<Input placeholder="Price (₹)" type="number" />
					</Form.Item>
					<Form.Item
						name="quantity"
						label="Quantity"
						rules={[
							{ type: "number", message: "Quantity must be a number" },
							{ required: true, message: "Please enter item quantity" },
						]}>
						<Input type="number" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default InvoiceTable;
