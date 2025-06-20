import React, { useEffect, useState } from "react";

import categoriesApi from "apis/categories";
import postApi from "apis/posts";
import { PageLoader, PageTitle } from "components/commons";
import Logger from "js-logger";
import { useParams } from "react-router-dom";

import Form from "./Form";

const Edit = ({ history }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [user, setUser] = useState("");

  const { slug } = useParams();
  const fetchPostDetails = async () => {
    try {
      const {
        data: {
          post: { title, description, categories, status, updated_at, user },
        },
      } = await postApi.show(slug);
      setTitle(title);
      setDescription(description);
      setCategories(
        categories.map(category => ({
          value: category.id,
          label: category.name,
        }))
      );
      setStatus(status);
      setUpdatedAt(updated_at);
      setUser(user);
    } catch (error) {
      Logger.info(error);
    }
  };

  const fetchCategoryDetails = async () => {
    try {
      const {
        data: { categories },
      } = await categoriesApi.fetch();
      setAllCategories(categories);
    } catch (error) {
      Logger.error(error);
    }
  };

  const editPost = async () => {
    setIsLoading(true);
    try {
      await postApi.update({
        slug,
        payload: {
          title,
          description,
          category_ids: categories.map(category => category.value),
          status,
        },
      });
      history.push("/");
    } catch (error) {
      Logger.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    await Promise.all([fetchCategoryDetails(), fetchPostDetails()]);
    setIsLoading(false);
  };

  const destroyPost = async () => {
    try {
      await postApi.destroy(slug);
      history.push("/");
    } catch (error) {
      Logger.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col gap-y-5">
      <PageTitle title="Edit task" />
      <Form
        allCategories={allCategories}
        categories={categories}
        description={description}
        destroyPost={destroyPost}
        handleSubmit={editPost}
        loading={isLoading}
        setCategories={setCategories}
        setDescription={setDescription}
        setStatus={setStatus}
        setTitle={setTitle}
        status={status}
        title={title}
        type="update"
        updatedAt={updatedAt}
        user={user}
      />
    </div>
  );
};

export default Edit;
