import axios from "axios";

const fetch = params => axios.get("/posts", { params });

const show = slug => axios.get(`/posts/${slug}`);

const create = payload =>
  axios.post("/posts", {
    post: payload,
  });

const update = ({ slug, payload, quiet = false }) => {
  const path = quiet ? `/posts/${slug}?quiet` : `/posts/${slug}`;
  axios.put(path, {
    post: payload,
  });
};

const destroy = ({ slug, quiet = false }) => {
  const path = quiet ? `/posts/${slug}?quiet` : `/posts/${slug}`;
  axios.delete(path);
};

const vote = (slug, payload) => axios.post(`/posts/${slug}/vote`, payload);

const postApi = { fetch, show, create, update, destroy, vote };

export default postApi;
