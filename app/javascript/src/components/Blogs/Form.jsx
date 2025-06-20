import React, { useState } from "react";

import { ExternalLink, MenuHorizontal } from "@bigbinary/neeto-icons";
import { Input, Button } from "components/commons";
import Logger from "js-logger";
import { ActionDropdown, Dropdown, Textarea } from "neetoui";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Select from "react-select";

import Preview from "./Preview";

const Form = ({
  type = "create",
  title,
  setTitle,
  status,
  setStatus,
  categories,
  setCategories,
  description,
  setDescription,
  loading,
  handleSubmit,
  allCategories,
  destroyPost,
  updatedAt,
  user,
}) => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);

  const categoryOptions = allCategories.map(category => ({
    value: category.id,
    label: category.name,
  }));
  const { Menu, MenuItem } = ActionDropdown;
  const { Menu: DropdownMenu, MenuItem: DropdownMenuItem } = Dropdown;

  return (
    <form
      className="mb-4 w-full space-y-4"
      onSubmit={event => {
        event.preventDefault();
        handleSubmit();
      }}
    >
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
        {type === "update" && (
          <ExternalLink
            className="cursor-pointer rounded-md hover:text-blue-900"
            onClick={() => setShowModal(prev => !prev)}
          />
        )}
        <Preview
          handleEdit={handleSubmit}
          setShowModal={setShowModal}
          showModal={showModal}
          updateTask={handleSubmit}
          post={{
            title,
            description,
            categories: categories.map(category => ({
              id: category.value,
              name: category.label,
            })),
            status,
            updated_at: updatedAt,
            user,
          }}
        />
        <Button
          buttonText="Cancel"
          loading={loading}
          onClick={() => history.push("/blogs")}
        />
        <ActionDropdown
          label={status === "draft" ? "Save as draft" : "Publish"}
          onClick={handleSubmit}
        >
          <Menu>
            <MenuItem.Button onClick={() => setStatus("draft")}>
              Save as draft
            </MenuItem.Button>
            <MenuItem.Button onClick={() => setStatus("published")}>
              Publish
            </MenuItem.Button>
          </Menu>
        </ActionDropdown>
        {type === "update" && (
          <Dropdown buttonStyle="text" icon={MenuHorizontal}>
            <DropdownMenu>
              <DropdownMenuItem.Button style="danger" onClick={destroyPost}>
                Delete
              </DropdownMenuItem.Button>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
      {Logger.info(showModal)}
    </form>
  );
};

export default Form;
