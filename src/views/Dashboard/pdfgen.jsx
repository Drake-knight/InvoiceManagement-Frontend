import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#FFF",
		padding: "5%",
	},
	header: {
		marginBottom: "5%",
		textAlign: "center",
	},
	headerText: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: "2%",
	},
	separator: {
		borderBottomWidth: 2,
		borderBottomColor: "#000",
		marginBottom: "5%",
	},
	section: {
		marginBottom: "5%",
	},
	sectionTitle: {
		fontWeight: "bold",
		marginBottom: "2%",
	},
	customerInfo: {
		marginBottom: "5%",
	},
	customerInfoItem: {
		marginBottom: "2%",
	},
	table: {
		display: "table",
		width: "100%",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#000",
		marginBottom: 10,
	},
	tableRow: {
		flexDirection: "row",
	},
	tableCol: {
		width: "33.33%",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#000",
		padding: 5,
	},
	tableHeader: {
		backgroundColor: "#f2f2f2",
	},
	tableCell: {
		fontSize: 10,
	},
});

const InvoicePDF = ({ record }) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.header}>
				<Text style={styles.headerText}>Invoice</Text>
				<View style={styles.separator} />
			</View>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Customer Details:</Text>
				<View style={styles.customerInfo}>
					<Text style={styles.customerInfoItem}>Name: {record.customer_name}</Text>
					<Text style={styles.customerInfoItem}>Phone: {record.customer_phone}</Text>
					<Text style={styles.customerInfoItem}>Email: {record.customer_email}</Text>
				</View>
			</View>
			<View style={styles.table}>
				<View style={[styles.tableRow, styles.tableHeader]}>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}>Item Name</Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}>Price</Text>
					</View>
					<View style={styles.tableCol}>
						<Text style={styles.tableCell}>Quantity</Text>
					</View>
				</View>
				{record.line_items.map((item, index) => (
					<View key={index} style={styles.tableRow}>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>{item.item_name}</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>{item.price}</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>{item.quantity}</Text>
						</View>
					</View>
				))}
			</View>
		</Page>
	</Document>
);

export default InvoicePDF;
