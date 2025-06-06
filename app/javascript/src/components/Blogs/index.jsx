import React, { useEffect, useState } from "react";

import Logger from "js-logger";

import Blog from "./Blog";

import postApi from "../../apis/posts";
import { formatDate } from "../../utils/formatDate";
import PageLoader from "../commons/PageLoader";
import PageTitle from "../commons/PageTitle";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const {
        data: { posts },
      } = await postApi.fetch();
      setBlogs(posts);
    } catch (error) {
      Logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div>
      <PageTitle title="Blog posts" />
      <div>
        {blogs.map(blog => (
          <Blog
            date={formatDate(blog.created_at)}
            description={blog.description}
            key={blog.id}
            title={blog.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
