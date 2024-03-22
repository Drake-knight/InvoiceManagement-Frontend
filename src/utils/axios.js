import Axios from "axios";

const isInProduction = import.meta.env.PROD;

const HOST = isInProduction ? "" : "http://localhost:5000";

const axios = Axios.create({
    baseURL: `${HOST}/data`,
    withCredentials: true,
});

export default axios;
