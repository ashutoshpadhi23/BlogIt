import axios from "axios";

const fetch = () => axios.get("/posts");

const show = slug => axios.get(`/posts/${slug}`);

const create = payload =>
  axios.post("/posts", {
    post: payload,
  });

const postApi = { fetch, show, create };

export default postApi;
