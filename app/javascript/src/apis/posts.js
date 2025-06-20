import axios from "axios";

const fetch = params => axios.get("/posts", { params });

const show = slug => axios.get(`/posts/${slug}`);

const create = payload =>
  axios.post("/posts", {
    post: payload,
  });

const update = ({ slug, payload }) =>
  axios.put(`/posts/${slug}`, {
    post: payload,
  });

const postApi = { fetch, show, create, update };

export default postApi;
