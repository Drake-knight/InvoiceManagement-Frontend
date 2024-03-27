import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import AddInvoice from "./AddInvoice.jsx";
import { Button, Layout, Menu, Breadcrumb, Typography, Spin } from "antd";
import InvoiceTable from "./InvoiceTable.jsx";
import AppFooter from "./Footer.jsx";
import { useHistory } from "react-router-dom";

const { Header, Content } = Layout;
const { Title } = Typography;

const Invoice = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [token, setToken] = useState("");
	const [userId, setUserId] = useState("");
	const history = useHistory();

	useEffect(() => {
		const storedUserId = localStorage.getItem("user_id");
		if (storedUserId) {
			setUserId(storedUserId);
		}
	}, []);

	const handleUnauthorized = (error) => {
		if (error.response && error.response.status === 401) {
			history.push("/login");
		}
	};

	useEffect(() => {
		const storedToken = localStorage.getItem("jwtToken");
		if (storedToken) {
			setToken(storedToken);
		}
	}, []);

	useEffect(() => {
		if (userId) {
			fetchData(userId);
		}
	}, [userId]);

	const fetchData = async (userId) => {
		try {
			setLoading(true);
			const response = await axios.get(`/invoices/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const rawData = response.data;

			const truncatedData = rawData.map((item) => ({
				...item,
				invoice_date: new Date(item.invoice_date).toISOString().split("T")[0],
			}));
			setData(truncatedData);
		} catch (error) {
			handleUnauthorized(error);
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (invoiceId) => {
		try {
			await axios.delete(`/invoices/${invoiceId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			fetchData(userId);
		} catch (error) {
			handleUnauthorized(error);
			console.error("Error deleting invoice:", error);
		}
	};

	const handleRemoveLine = async (line_item_id) => {
		try {
			await axios.delete(`/line-items/${line_item_id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			fetchData(userId);
		} catch (error) {
			handleUnauthorized(error);
			console.error("Error deleting invoice:", error);
		}
	};

	const handleAddInvoice = async (values) => {
		try {
			await axios.post("/invoices", values, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			fetchData(userId);
			setModalVisible(false);
		} catch (error) {
			handleUnauthorized(error);
			console.error("Error adding invoice:", error);
		}
	};

	const handleAddLine = async (values) => {
		try {
			await axios.post("/line-items", values, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			fetchData(userId);
			setModalVisible(false);
		} catch (error) {
			handleUnauthorized(error);
			console.error("Error adding invoice:", error);
		}
	};

	const handleUpdateInvoice = async (values) => {
		try {
			await axios.put(`/invoices/${values.invoice_id}`, values, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			fetchData(userId);
			setModalVisible(false);
		} catch (error) {
			handleUnauthorized(error);
			console.error("Error adding invoice:", error);
		}
	};

	const handleUpdateLine = async (values, line_item_id) => {
		try {
			await axios.put(`/line-items/${line_item_id}`, values, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			fetchData(userId);
			setModalVisible(false);
		} catch (error) {
			handleUnauthorized(error);
			console.error("Error adding invoice:", error);
		}
	};

	const handleCancel = () => {
		setModalVisible(false);
	};

	const handleLogout = async () => {
		try {
			await axios.get("/logout", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			localStorage.removeItem("jwtToken");
			localStorage.removeItem("user_id");
			history.push("/login");
		} catch (error) {
			console.error("Error logging out:", error);
		}
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
							handleRemoveLine={handleRemoveLine}
							handleAddLine={handleAddLine}
							handleUpdateLine={handleUpdateLine}
						/>
					)}
				</div>
			</Content>
			<AppFooter />
		</Layout>
	);
};

export default Invoice;
