import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import AddInvoice from "./AddInvoice.jsx";
import { Button, Layout, Menu, Breadcrumb, Typography, Spin } from "antd";
import InvoiceTable from "./InvoiceTable.jsx";
import getCookieToken from "../../utils/getCookieToken";
import AppFooter from "./Footer.jsx";

const { Header, Content } = Layout;
const { Title } = Typography;

const Invoice = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const userInfo = getCookieToken();
	const user_id = userInfo.userId;

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`/invoices/${user_id}`);

			const rawData = await response.data;
			const truncatedData = rawData.map((item) => ({
				...item,
				invoice_date: new Date(item.invoice_date).toISOString().split("T")[0],
			}));
			setData(truncatedData);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (invoiceId) => {
		try {
			await axios.delete(`/invoices/${invoiceId}`);
			fetchData();
		} catch (error) {
			console.error("Error deleting invoice:", error);
		}
	};

	const handleAddInvoice = async (values) => {
		try {
			await axios.post("/invoices", values);
			fetchData();
			setModalVisible(false);
		} catch (error) {
			console.error("Error adding invoice:", error);
		}
	};

	const handleUpdateInvoice = async (values) => {
		try {
			await axios.put(`/invoices/${values.invoice_id}`, values);
			fetchData();
			setModalVisible(false);
		} catch (error) {
			console.error("Error adding invoice:", error);
		}
	};

	const handleCancel = () => {
		setModalVisible(false);
	};

	const handleLogout = async () => {
		await axios.get("/logout");
		window.location.reload();
	};

	return (
		<Layout className="layout">
			<Header
				style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<div>
					<Title level={3} style={{ color: "white", margin: 0 }}>
						Invoice
					</Title>
				</div>
				<div>
					<Button
						type="primary"
						onClick={() => setModalVisible(true)}
						style={{ marginLeft: "10px" }}>
						Add Invoice
					</Button>
					<Button type="primary" onClick={handleLogout} style={{ marginLeft: "10px" }}>
						Logout
					</Button>
				</div>
			</Header>
			<Content style={{ padding: "0 50px" }}>
				<div className="site-layout-content">
					<div
						style={{
							marginBottom: "20px",
							display: "flex",
							justifyContent: "space-between",
						}}>
						<Title level={2}>Invoices</Title>
					</div>
					<AddInvoice
						visible={modalVisible}
						setVisible={setModalVisible}
						onCreate={handleAddInvoice}
						fetchData={fetchData}
						onCancel={handleCancel}
					/>
					{loading ? (
						<Spin size="large" />
					) : (
						<InvoiceTable
							data={data}
							handleDelete={handleDelete}
							handleUpdateInvoice={handleUpdateInvoice}
						/>
					)}
				</div>
			</Content>
			<AppFooter />
		</Layout>
	);
};

export default Invoice;
