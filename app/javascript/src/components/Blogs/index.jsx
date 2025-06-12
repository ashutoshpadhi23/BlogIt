import React, { useEffect, useState } from "react";

import Logger from "js-logger";
import { Link } from "react-router-dom";

import Blog from "./Blog";

import postApi from "../../apis/posts";
import { formatDate } from "../../utils/formatDate";
import PageLoader from "../commons/PageLoader";
import PageTitle from "../commons/PageTitle";

const Blogs = ({ history }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const showBlog = slug => {
    history.push(`/blogs/${slug}/show`);
  };

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
      <Link
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:shadow"
        to="/blogs/create"
      >
        Add new task
      </Link>
      <div>
        {blogs.map(blog => (
          <div key={blog.id}>
            <Blog
              blog={blog}
              date={formatDate(blog.created_at)}
              description={blog.description}
              showBlog={showBlog}
              title={blog.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
