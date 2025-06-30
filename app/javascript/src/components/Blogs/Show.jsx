import React, { useEffect, useState } from "react";

import postApi from "apis/posts";
import createConsumer from "channels/consumer";
import { subscribeToReportDownloadChannel } from "channels/reportDownloadChannel";
import { PageLoader } from "components/commons";
import FileSaver from "file-saver";
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
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const consumer = createConsumer();
  let subscription = null;

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

  const downloadPdf = async slug => {
    setPageLoading(true);
    try {
      const { data } = await postApi.download(slug);
      FileSaver.saveAs(data, "blogit_post_report.pdf");
    } catch (error) {
      Logger.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  useEffect(() => {
    if (progress === 100 && isDownloadModalOpen) {
      setIsDownloadModalOpen(false);
    }
  }, [progress]);

  const handleDownload = slug => {
    subscription = subscribeToReportDownloadChannel({
      consumer,
      setMessage,
      setProgress,
      generatePdf,
      slug,
    });

    setTimeout(() => {
      downloadPdf(slug);
      if (subscription) {
        subscription.unsubscribe();
      }
      consumer.disconnect();
    }, 5000);
  };

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <PostDetails
      canEdit={canEdit}
      handleDownload={handleDownload}
      isDownloadModalOpen={isDownloadModalOpen}
      message={message}
      post={post}
      progress={progress}
      setIsDownloadModalOpen={setIsDownloadModalOpen}
      updateTask={updateTask}
    />
  );
};

export default Show;
