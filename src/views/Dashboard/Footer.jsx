import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const AppFooter = () => {
	const openGitHub = () => {
		window.open("https://github.com/Drake-knight", "_blank");
	};

	return (
		<Footer style={{ textAlign: "center" }}>
			Invoice Manager Created by{" "}
			<a href="#" onClick={openGitHub}>
				Vishal
			</a>
		</Footer>
	);
};

export default AppFooter;
