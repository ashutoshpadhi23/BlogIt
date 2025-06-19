import React, { useEffect, useState } from "react";

import postApi from "apis/posts";
import { PageTitle } from "components/commons";
import Logger from "js-logger";

import Form from "./Form";

import categoriesApi from "../../apis/categories";

const Create = ({ history }) => {
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState({});
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      await postApi.create({
        title,
        description,
        category_ids: categories.map(category => category.value),
        user_id: 1,
      });
      setLoading(false);
      history.push("/blogs");
    } catch (error) {
      Logger.error(error);
      setLoading(false);
    }
  };

  const fetchCategoryDetails = async () => {
    try {
      const {
        data: { categories },
      } = await categoriesApi.fetch();
      setAllCategories(categories);
      setCategory(categories[0]);
      setCategoryId(categories[0].id);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  return (
    <div className="flex flex-col gap-y-8">
      <PageTitle title="New blog post" />
      <Form
        allCategories={allCategories}
        categories={categories}
        category={category}
        categoryId={categoryId}
        description={description}
        handleSubmit={handleSubmit}
        loading={loading}
        setAllCategories={setAllCategories}
        setCategories={setCategories}
        setCategory={setCategory}
        setCategoryId={setCategoryId}
        setDescription={setDescription}
        setTitle={setTitle}
      />
    </div>
  );
};

export default Create;
