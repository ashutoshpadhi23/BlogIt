import axios from "axios";

const fetch = () => axios.get("/categories");

const create = payload =>
  axios.post("/categories", {
    category: payload,
  });

const categoriesApi = { fetch, create };

export default categoriesApi;
