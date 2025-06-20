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
  // const history = useHistory();

  const { slug } = useParams();
  const fetchPostDetails = async () => {
    try {
      const {
        data: {
          post: { title, description, categories },
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

  const editPost = async event => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await postApi.update({
        slug,
        payload: {
          title,
          description,
          category_ids: categories.map(category => category.value),
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

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      <PageTitle title="Edit task" />
      <Form
        allCategories={allCategories}
        categories={categories}
        description={description}
        handleSubmit={editPost}
        loading={isLoading}
        setCategories={setCategories}
        setDescription={setDescription}
        setTitle={setTitle}
        title={title}
        type="update"
      />
    </div>
  );
};

export default Edit;
