import React, { useEffect, useState } from "react";

import { Filter, MenuHorizontal } from "@bigbinary/neeto-icons";
import categoryApi from "apis/categories";
import postApi from "apis/posts";
import { PageLoader } from "commons";
import Logger from "js-logger";
import {
  Tooltip,
  Tag,
  Dropdown,
  Checkbox,
  Button,
  Pane,
  Typography,
  Input,
} from "neetoui";
import { isEmpty } from "ramda";
import Select from "react-select";
import { formatDate } from "utils/formatDate";
import { getFromLocalStorage } from "utils/storage";
import toTitleCase from "utils/toTitleCase";

import PostsTable from "./Table";

const UserBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showColumns, setShowColumns] = useState({
    title: true,
    category: true,
    lastPublishedAt: true,
    status: true,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showPane, setShowPane] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    categories: [],
    status: "",
  });
  const [categoryOptions, setCategoryOptions] = useState([]);

  const userId = getFromLocalStorage("authUserId");
  const { Menu: DropdownMenu, MenuItem: DropdownMenuItem } = Dropdown;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const {
          data: { categories },
        } = await categoryApi.fetch();

        setCategoryOptions(
          categories.map(category => ({
            value: category.id,
            label: category.name,
          }))
        );
      } catch (error) {
        Logger.error(error);
      }
    }
    fetchCategories();
  }, []);

  const columns = [
    {
      dataIndex: "title",
      title: "Title",
      width: "30%",
      render: (_title, row) => (
        <Tooltip content={_title} position="top">
          <a
            className="max-w-[400px] truncate"
            href={`/blogs/${row.slug}/show`}
          >
            {_title}
          </a>
        </Tooltip>
      ),
    },
    {
      dataIndex: "category",
      title: "Category",
      width: "20%",
      render: categories => (
        <div className="flex flex-wrap gap-1">
          {categories.map((category, index) => (
            <Tag key={index} label={category} />
          ))}
        </div>
      ),
    },
    {
      dataIndex: "lastPublishedAt",
      title: "Last Published At",
      width: "25%",
      render: lastPublishedAt => <div>{formatDate(lastPublishedAt)}</div>,
    },
    {
      dataIndex: "status",
      title: "Status",
      width: "15%",
      render: status => (
        <Tag
          label={toTitleCase(status)}
          style={status === "draft" ? "danger" : "primary"}
        />
      ),
    },
    {
      dataIndex: "actions",
      title: "",
      width: "10%",
      render: (_value, row) => (
        <div className="relative z-10">
          <Dropdown
            buttonStyle="text"
            icon={MenuHorizontal}
            position="right-start"
            strategy="fixed"
          >
            <DropdownMenu>
              <DropdownMenuItem.Button
                style="secondary"
                onClick={() => editPublishStatus(row.slug, row.status)}
              >
                {row.status === "draft" ? "Publish" : "Unpublish"}
              </DropdownMenuItem.Button>
              <DropdownMenuItem.Button
                style="danger"
                onClick={() => destroyPost(row.slug)}
              >
                Delete
              </DropdownMenuItem.Button>
            </DropdownMenu>
          </Dropdown>
        </div>
      ),
    },
  ];

  // Filter columns based on showColumns state
  const filteredColumns = columns.filter(col => {
    if (col.dataIndex === "title") return showColumns.title;

    if (col.dataIndex === "category") return showColumns.category;

    if (col.dataIndex === "lastPublishedAt") return showColumns.lastPublishedAt;

    if (col.dataIndex === "status") return showColumns.status;

    return true; // actions column always shown
  });

  const onSelectChange = newSelectedRowKeys => {
    Logger.info("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const isFilterApplied =
    (filters.title && filters.title.trim() !== "") ||
    (filters.status && filters.status !== "") ||
    (filters.categories && !isEmpty(filters.categories));

  const buildFilterParams = (filters = {}) => {
    const params = { user_id: userId };
    if (filters.title) params.title = filters.title;

    if (filters.status) params.status = filters.status;

    if (filters.categories?.length > 0) {
      params.category_names = filters.categories.map(cat => cat.label);
    }

    return params;
  };

  const fetchPostDetails = async (filters = {}) => {
    setLoading(true);
    try {
      const params = buildFilterParams(filters);
      const {
        data: { posts },
      } = await postApi.fetch(params);

      setData(
        posts.map(post => ({
          key: post.id,
          id: post.id,
          title: post.title,
          category: post.categories.map(category => category.name),
          lastPublishedAt: post.updated_at,
          status: post.status,
          slug: post.slug,
        }))
      );
    } catch (error) {
      Logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const destroyPost = async slug => {
    try {
      await postApi.destroy({ slug, quiet: true });
      fetchPostDetails();
    } catch (error) {
      Logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const editPublishStatus = async (slug, currentStatus) => {
    const newStatus = currentStatus === "draft" ? "published" : "draft";
    try {
      await postApi.update({
        slug,
        payload: {
          status: newStatus,
        },
        quiet: true,
      });
      fetchPostDetails();
    } catch (error) {
      Logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterSlugs = () =>
    data
      .filter(post => selectedRowKeys.includes(post.id))
      .map(post => post.slug);

  useEffect(() => {
    fetchPostDetails();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="relative overflow-visible">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-4xl font-bold">My blogs</h1>
        <div className="flex items-center gap-x-2">
          <Dropdown
            buttonStyle="primary"
            closeOnSelect={false}
            label="Columns"
            strategy="fixed"
          >
            <DropdownMenu>
              <DropdownMenuItem>
                <Checkbox
                  disabled
                  checked={showColumns.title}
                  className="mb-2"
                  label="Title"
                />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Checkbox
                  checked={showColumns.category}
                  className="mb-2"
                  label="Category"
                  onChange={event =>
                    setShowColumns(prev => ({
                      ...prev,
                      category: event.target.checked,
                    }))
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Checkbox
                  checked={showColumns.lastPublishedAt}
                  className="mb-2"
                  label="Last Published At"
                  onChange={event =>
                    setShowColumns(prev => ({
                      ...prev,
                      lastPublishedAt: event.target.checked,
                    }))
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Checkbox
                  checked={showColumns.status}
                  className="mb-2"
                  label="Status"
                  onChange={event =>
                    setShowColumns(prev => ({
                      ...prev,
                      status: event.target.checked,
                    }))
                  }
                />
              </DropdownMenuItem>
            </DropdownMenu>
          </Dropdown>
          <div>
            <div className="w-full">
              <div className="space-y-6">
                <div className="space-y-8">
                  <div className="flex flex-row flex-wrap items-center justify-start gap-6">
                    <Button icon={Filter} onClick={() => setShowPane(true)} />
                  </div>
                </div>
              </div>
              <Pane isOpen={showPane} onClose={() => setShowPane(false)}>
                <Pane.Header>
                  <Typography style="h2" weight="semibold">
                    Filter blogs
                  </Typography>
                </Pane.Header>
                <Pane.Body>
                  <div className="w-full">
                    <Input
                      label="Title"
                      placeholder="Search by title"
                      value={filters.title}
                      onChange={e =>
                        setFilters(prev => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                    <label className="mb-1 text-sm font-medium text-gray-800">
                      Categories
                    </label>
                    <Select
                      isMulti
                      isSearchable
                      menuPosition="absolute"
                      options={categoryOptions}
                      value={filters.categories}
                      onChange={selected =>
                        setFilters(prev => ({
                          ...prev,
                          categories: selected || [],
                        }))
                      }
                    />
                    <label className="mb-1 text-sm font-medium text-gray-800">
                      Status
                    </label>
                    <Select
                      isSearchable
                      menuPosition="absolute"
                      options={[
                        { value: "draft", label: "Draft" },
                        { value: "published", label: "Published" },
                      ]}
                      value={
                        filters.status
                          ? {
                              value: filters.status,
                              label:
                                filters.status.charAt(0).toUpperCase() +
                                filters.status.slice(1),
                            }
                          : null
                      }
                      onChange={selected =>
                        setFilters(prev => ({
                          ...prev,
                          status: selected ? selected.value : "",
                        }))
                      }
                    />
                  </div>
                </Pane.Body>
                <Pane.Footer className="flex items-center space-x-2">
                  <Button
                    label="Apply"
                    onClick={() => {
                      setShowPane(false);
                      fetchPostDetails(filters);
                    }}
                  />
                  <Button
                    label="Reset"
                    style="text"
                    onClick={() => {
                      const resetFilters = {
                        title: "",
                        categories: [],
                        status: "",
                      };
                      setFilters(resetFilters);
                      setShowPane(false);
                      fetchPostDetails(resetFilters);
                    }}
                  />
                </Pane.Footer>
              </Pane>
            </div>
          </div>
        </div>
      </div>
      {isFilterApplied && (
        <div className="mb-4 flex items-center space-x-2 p-4">
          <div>
            <span className="font-semibold">Selected {data.length} blogs</span>
          </div>
          {filters.title && (
            <Tag
              label={filters.title}
              onClose={() => {
                const newFilters = { ...filters, title: "" };
                setFilters(newFilters);
                fetchPostDetails(newFilters);
              }}
            />
          )}
          {!isEmpty(filters.categories) &&
            filters.categories.map((category, index) => (
              <Tag
                key={index}
                label={category.label}
                onClose={() => {
                  const newCategories = filters.categories.filter(
                    c => c.value !== category.value
                  );
                  const newFilters = { ...filters, categories: newCategories };
                  setFilters(newFilters);
                  fetchPostDetails(newFilters);
                }}
              />
            ))}
          {filters.status && (
            <Tag
              label={
                filters.status.charAt(0).toUpperCase() + filters.status.slice(1)
              }
              onClose={() => {
                const newFilters = { ...filters, status: "" };
                setFilters(newFilters);
                fetchPostDetails(newFilters);
              }}
            />
          )}
        </div>
      )}
      {hasSelected && (
        <div className="mb-4 flex items-center space-x-2 p-4">
          <div>Selected {selectedRowKeys.length} blogs</div>
          <Dropdown
            buttonStyle="primary"
            closeOnSelect={false}
            label="Change status"
            strategy="fixed"
          >
            <DropdownMenu>
              <DropdownMenuItem.Button
                style="secondary"
                onClick={() =>
                  filterSlugs().forEach(slug =>
                    editPublishStatus(slug, "draft")
                  )
                }
              >
                Publish
              </DropdownMenuItem.Button>
              <DropdownMenuItem.Button
                style="secondary"
                onClick={() =>
                  filterSlugs().forEach(slug =>
                    editPublishStatus(slug, "published")
                  )
                }
              >
                Draft
              </DropdownMenuItem.Button>
            </DropdownMenu>
          </Dropdown>
          <Button
            disabled={!hasSelected}
            loading={loading}
            style="danger"
            onClick={() => {
              filterSlugs().forEach(slug => destroyPost(slug));
              setSelectedRowKeys([]);
            }}
          >
            Delete
          </Button>
        </div>
      )}
      <PostsTable
        columns={filteredColumns}
        data={data}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default UserBlogs;
