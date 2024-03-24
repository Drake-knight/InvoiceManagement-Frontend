import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Layout, Spin } from "antd";
import Invoice from "./views/Dashboard/Invoice.jsx";
import Login from "./views/Login/index.jsx";
import RegistrationForm from "./views/Register/index.jsx";
import { getToken } from "./utils/getToken.js";

const { Content } = Layout;

function App() {
	return (
		<Layout id="app">
			<Router basename="/">
				<Switch>
					<Route exact path="/register" component={RegistrationForm} />
					<Route exact path="/login" component={Login} />
					<Route
						path="/invoice"
						render={() => {
							const isLoggedIn = getToken();

							return isLoggedIn ? (
								<Route exact path="/invoice" component={Invoice} />
							) : (
								<Redirect to="/login" />
							);
						}}
					/>

					<Route path="*">
						<Redirect to="/login" />
					</Route>
				</Switch>
			</Router>
		</Layout>
	);
}

export default App;
