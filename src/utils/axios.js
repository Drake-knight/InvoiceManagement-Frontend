import Axios from "axios";

const isInProduction = import.meta.env.PROD;
const baseAPIPath = import.meta.env.BASE_URL;

const HOST = !isInProduction ? "http://52.66.117.99:8001" : "http://localhost:5100";

const axios = Axios.create({
	baseURL: `${HOST}${baseAPIPath}`,
	withCredentials: true,
});

export default axios;
