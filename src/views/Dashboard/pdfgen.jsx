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
	section: {
		marginBottom: "5%",
	},
	sectionTitle: {
		fontWeight: "bold",
		marginBottom: 5,
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
				<Text style={{ fontSize: 20 }}>Invoice</Text>
			</View>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Customer Details:</Text>
				<Text>{record.customer_name}</Text>
				<Text>{record.customer_phone}</Text>
				<Text>{record.customer_email}</Text>
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
