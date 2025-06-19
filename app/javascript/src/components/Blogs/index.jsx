import React, { useEffect, useState } from "react";

import Logger from "js-logger";
import { Link, useLocation } from "react-router-dom";

import Blog from "./Blog";

import postApi from "../../apis/posts";
import { formatDate } from "../../utils/formatDate";
import PageLoader from "../commons/PageLoader";
import PageTitle from "../commons/PageTitle";

const Blogs = ({ history, fetchFiltered = false }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const filterParams = {};
  for (const [key, value] of params.entries()) {
    if (filterParams[key]) {
      filterParams[key] = [].concat(filterParams[key], value);
    } else {
      filterParams[key] = value;
    }
  }

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

  const fetchFilteredBlogs = async () => {
    try {
      const {
        data: { posts },
      } = await postApi.fetch(filterParams);
      setBlogs(posts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      logger.error(error);
    }
  };

  useEffect(() => {
    if (fetchFiltered) {
      fetchFilteredBlogs();
    } else {
      fetchBlogs();
    }
  }, [fetchFiltered, search]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="h-full">
      <div className="flex justify-between">
        <PageTitle title="Blog posts" />
        <Link
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:shadow"
          to="/blogs/create"
        >
          Add new blog post
        </Link>
      </div>
      <div className="h-full overflow-y-auto">
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
      {Logger.info(blogs)}
    </div>
  );
};

export default Blogs;
