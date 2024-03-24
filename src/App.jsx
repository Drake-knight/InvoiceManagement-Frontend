import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";
import Invoice from "./views/Dashboard/Invoice.jsx";
import Login from "./views/Login/index.jsx";
import RegistrationForm from "./views/Register/index.jsx";
import getCookieToken from "./utils/getCookieToken";

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
							const isLoggedIn = getCookieToken();

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
