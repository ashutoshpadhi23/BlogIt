import React, { useEffect, useState } from "react";

import postApi from "apis/posts";
import { PageLoader, Toastr } from "components/commons";
import Logger from "js-logger";
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

  const generatePdf = async slug => {
    try {
      await postApi.generatePdf(slug);
    } catch (error) {
      Logger.error(error);
    }
  };

  const saveAs = ({ blob, fileName }) => {
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(objectUrl), 150);
  };

  const downloadPdf = async slug => {
    try {
      Toastr.success("Downloading report...");
      const { data } = await postApi.download(slug);
      saveAs({ blob: data, fileName: "blogit_post_report.pdf" });
    } catch (error) {
      Logger.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  const handleDownload = slug => {
    generatePdf(slug);
    setTimeout(() => {
      downloadPdf(slug);
    }, 5000);
  };

  const message = pageLoading
    ? "Report is being generated..."
    : "Report downloaded!";

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <PostDetails
      canEdit={canEdit}
      handleDownload={handleDownload}
      message={message}
      post={post}
      updateTask={updateTask}
    />
  );
};

export default Show;
