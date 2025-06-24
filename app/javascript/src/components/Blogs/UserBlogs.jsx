import React, { useEffect, useState } from "react";

import { MenuHorizontal } from "@bigbinary/neeto-icons";
import postApi from "apis/posts";
import { PageLoader } from "commons";
import Logger from "js-logger";
import { Tooltip, Tag, Dropdown } from "neetoui";
import { formatDate } from "utils/formatDate";
import { getFromLocalStorage } from "utils/storage";
import toTitleCase from "utils/toTitleCase";

import PostsTable from "./Table";

const UserBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const userId = getFromLocalStorage("authUserId");
  const { Menu: DropdownMenu, MenuItem: DropdownMenuItem } = Dropdown;

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

  const fetchPostDetails = async () => {
    try {
      const {
        data: { posts },
      } = await postApi.fetch({ user_id: userId });

      setData(
        posts.map(post => ({
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
      await postApi.destroy(slug);
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
      });
      fetchPostDetails();
    } catch (error) {
      Logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="relative overflow-visible">
      <PostsTable columns={columns} data={data} />
    </div>
  );
};

export default UserBlogs;
