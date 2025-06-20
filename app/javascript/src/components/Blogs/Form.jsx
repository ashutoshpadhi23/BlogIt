import React from "react";

import { Input, Button } from "components/commons";
import { Textarea } from "neetoui";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Select from "react-select";

const Form = ({
  type = "create",
  title,
  setTitle,
  categories,
  setCategories,
  description,
  setDescription,
  loading,
  handleSubmit,
  allCategories,
}) => {
  const history = useHistory();

  const categoryOptions = allCategories.map(category => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <form className="mb-4 w-full space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Title"
        placeholder="Todo Title (Max 50 Characters Allowed)"
        value={title}
        onChange={e => setTitle(e.target.value.slice(0, 50))}
      />
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-800">
          Categories
        </label>
        <Select
          isMulti
          isSearchable
          menuPosition="fixed"
          options={categoryOptions}
          value={categories}
          onChange={selected => setCategories(selected)}
        />
      </div>
      <Textarea
        label="Description"
        placeholder="Todo Description (Max 100 Characters Allowed)"
        rows={8}
        value={description}
        onChange={event => setDescription(event.target.value.slice(0, 100))}
      />
      <div className="flex gap-x-2 pt-2">
        <Button
          buttonText="Cancel"
          loading={loading}
          onClick={() => history.push("/blogs")}
        />
        <Button
          buttonText={type === "create" ? "Submit" : "Update"}
          loading={loading}
          type="submit"
        />
      </div>
    </form>
  );
};

export default Form;
