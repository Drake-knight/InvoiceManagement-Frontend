import Axios from "axios";

const isInProduction = import.meta.env.PROD;
const baseAPIPath = import.meta.env.BASE_URL;

const HOST = isInProduction ? "https://invoicemanagement-backend.onrender.com" : "http://localhost:5100";

const axios = Axios.create({
	baseURL: `${HOST}${baseAPIPath}`,
	withCredentials: true,
});

export default axios;
