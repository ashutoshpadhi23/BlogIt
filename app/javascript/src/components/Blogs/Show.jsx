import React, { useEffect, useState } from "react";

import postApi from "apis/posts";
import { PageLoader } from "components/commons";
import { useHistory, useParams } from "react-router-dom";
import { getFromLocalStorage } from "utils/storage";

import PostDetails from "./PostDetails";

const Show = () => {
  const [post, setPost] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const { slug } = useParams();
  const history = useHistory();
  const [postUserId, setPostUserId] = useState("");
  const currentUserId = getFromLocalStorage("authUserId");

  const updateTask = () => {
    history.push(`/blogs/${post.slug}/edit`);
  };

  const fetchPostDetails = async () => {
    try {
      const {
        data: { post },
      } = await postApi.show(slug);
      setPost(post);
      setPostUserId(post.user.id);
      setPageLoading(false);
    } catch (error) {
      logger.error(error);
      history.push("/");
    }
  };

  const canEdit = () => postUserId === currentUserId;

  useEffect(() => {
    fetchPostDetails();
  }, []);

  if (pageLoading) {
    return <PageLoader />;
  }

  return <PostDetails canEdit={canEdit} post={post} updateTask={updateTask} />;
};

export default Show;
