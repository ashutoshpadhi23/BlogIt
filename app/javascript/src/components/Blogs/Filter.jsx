import React, { useEffect, useState } from "react";

import { Search, Plus } from "@bigbinary/neeto-icons";
import classNames from "classnames";
import { PageLoader } from "components/commons";
import Logger from "js-logger";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Blogs from ".";

import categoriesApi from "../../apis/categories";
import { Modal } from "../commons";

const Filter = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  const fetchCategoryDetails = async () => {
    try {
      const {
        data: { categories },
      } = await categoriesApi.fetch();
      setCategories(categories);
    } catch (error) {
      Logger.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  useEffect(() => {
    const sortedSelected = [...selectedCategories].sort();
    const params = sortedSelected
      .map(
        categoryLabel => `category_names[]=${encodeURIComponent(categoryLabel)}`
      )
      .join("&");

    history.replace({
      pathname: "/blogs/filter",
      search: params ? `?${params}` : "",
    });
  }, [selectedCategories, history]);

  const handleCreateCategory = async name => {
    try {
      await categoriesApi.create({ name });
      fetchCategoryDetails();
      setShowModal(false);
      setIsLoading(false);
    } catch (error) {
      setShowModal(false);
      setIsLoading(false);
      logger.error(error);
    }
  };

  const filteredCategories = searchTerm
    ? categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;

  const toggleCategoryFilter = event => {
    const category = event.target.innerText;
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter(item => item !== category);
      }

      return [...prevSelected, category];
    });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex h-full w-full">
      <Modal
        input_label="Category title"
        input_placeholder="Enter category name"
        isOpen={showModal}
        title="New category"
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateCategory}
      />
      <div className="flex flex-col">
        <div className="-ml-12 mr-4 flex w-96 justify-start bg-gray-400 p-4 ">
          <h2 className="text-2xl font-bold">Categories</h2>
          <div>
            {showSearch || searchTerm ? (
              <input
                autoFocus
                className="ml-2 rounded border px-2 text-sm"
                placeholder="Search category"
                type="text"
                value={searchTerm}
                onBlur={e => {
                  if (!e.target.value) setShowSearch(false);
                }}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  if (!showSearch) setShowSearch(true);
                }}
                onKeyDown={e => {
                  if (e.key === "Escape") {
                    setSearchTerm("");
                    setShowSearch(false);
                  }
                }}
              />
            ) : (
              <Search
                className="cursor-pointer"
                onClick={() => setShowSearch(true)}
              />
            )}
          </div>
          <div>
            <Plus
              className="cursor-pointer"
              size={24}
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
        <ul className="-ml-12 mt-4 space-y-4">
          {filteredCategories.map(category => (
            <li
              key={category.id}
              className={classNames(
                "cursor-pointer rounded-lg px-4 py-2 text-lg",
                {
                  "bg-white hover:bg-gray-50": selectedCategories.includes(
                    category.name
                  ),
                  "bg-gray-200 hover:bg-gray-300": !selectedCategories.includes(
                    category.name
                  ),
                }
              )}
              onClick={toggleCategoryFilter}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="ml-4 w-full">
        <Blogs
          fetchFiltered
          history={{ push: path => (window.location.href = path) }}
        />
      </div>
    </div>
  );
};

export default Filter;
