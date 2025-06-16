import React from "react";

import { Input, Button } from "components/commons";
import Select from "react-select";

const Form = ({
  type = "create",
  title,
  setTitle,
  setCategories,
  description,
  setDescription,
  loading,
  handleSubmit,
  allCategories,
}) => {
  const categoryOptions = allCategories.map(category => ({
    value: category.id,
    label: category.name,
  }));
  // const defaultOption = { value: categoryId, label: category.name };
  // const initialValues = useRef({
  //   title,
  //   categoryId: category.id,
  // });

  return (
    <form className="mb-4 w-full space-y-2" onSubmit={handleSubmit}>
      <Input
        label="Title"
        placeholder="Todo Title (Max 50 Characters Allowed)"
        value={title}
        onChange={e => setTitle(e.target.value.slice(0, 50))}
      />
      <div className="flex flex-col">
        <p className="text-sm font-medium leading-none text-gray-800">
          Category
        </p>
        <div className="mt-1 w-full">
          <Select
            isMulti
            isSearchable
            // defaultValue={defaultOption}
            menuPosition="fixed"
            options={categoryOptions}
            onChange={selected => setCategories(selected)}
          />
        </div>
      </div>
      <Input
        label="Description"
        placeholder="Todo Title (Max 50 Characters Allowed)"
        value={description}
        onChange={e => setDescription(e.target.value.slice(0, 100))}
      />
      <Button
        buttonText={type === "create" ? "Create Task" : "Update Task"}
        loading={loading}
        type="submit"
      />
    </form>
  );
};

export default Form;
