import React, { useEffect, useState } from "react";

import postApi from "apis/posts";
import { Button, PageLoader } from "components/commons";
import { Tag } from "neetoui";
import { useHistory, useParams } from "react-router-dom";

import { formatDate } from "../../utils/formatDate";
import Profile from "../commons/Profile";

const Show = () => {
  const [post, setPost] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const { slug } = useParams();
  const history = useHistory();

  const updateTask = () => {
    history.push(`/blogs/${post.slug}/edit`);
  };

  const fetchPostDetails = async () => {
    try {
      const {
        data: { post },
      } = await postApi.show(slug);
      setPost(post);
      setPageLoading(false);
    } catch (error) {
      logger.error(error);
      history.push("/");
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex space-x-2">
        {post.categories.map(category => (
          <Tag key={category.id}>{category.name}</Tag>
        ))}
      </div>
      <div className="flex w-full items-start justify-between gap-x-6">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-3xl font-semibold">{post?.title}</h2>
        </div>
        <div className="flex items-center justify-end gap-x-3">
          <Button
            buttonText="Edit"
            icon="edit-line"
            size="small"
            style="secondary"
            onClick={updateTask}
          />
        </div>
      </div>
      <div className="flex space-x-2">
        <Profile />
        <div className="text-sm text-gray-500">
          <p>{post?.user?.name}</p>
          <p>{formatDate(post.updated_at)}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500">{post?.description}</p>
    </div>
  );
};

export default Show;
