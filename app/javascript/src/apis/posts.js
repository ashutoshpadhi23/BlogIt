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

const generatePdf = slug => axios.post(`/posts/${slug}/report`, {});

const download = slug =>
  axios.get(`/posts/${slug}/report/download`, { responseType: "blob" });

const postApi = {
  fetch,
  show,
  create,
  update,
  destroy,
  vote,
  generatePdf,
  download,
};

export default postApi;
