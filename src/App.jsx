import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";
import Invoice from "./views/Dashboard/Invoice.jsx";
import Login from "./views/Login/index.jsx";
import RegistrationForm from "./views/Register/index.jsx";
import getCookieToken from "./utils/getCookieToken";

function App() {
	const isLoggedIn = getCookieToken();

	return (
		<Layout id="app">
			<Router basename="/">
				<Switch>
					<Route exact path="/register" component={RegistrationForm} />
					<Route exact path="/login" component={Login} />
					<Route
						exact
						path="/invoice"
						render={() => (isLoggedIn ? <Invoice /> : <Redirect to="/login" />)}
					/>
					<Redirect from="/" to="/login" />
				</Switch>
			</Router>
		</Layout>
	);
}

export default App;
