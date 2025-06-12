import React, { useState } from "react";

import postApi from "apis/posts";
import { PageTitle } from "components/commons";

import Form from "./Form";

const Create = ({ history }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      await postApi.create({ title, description });
      setLoading(false);
      history.push("/blogs");
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <PageTitle title="Add new task" />
      <Form
        handleSubmit={handleSubmit}
        loading={loading}
        setDescription={setDescription}
        setTitle={setTitle}
      />
    </div>
  );
};

export default Create;
