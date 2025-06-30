import React from "react";

import { Download, Edit } from "@bigbinary/neeto-icons";
import Profile from "commons/Profile";
import { Button, Tag } from "neetoui";
import { formatDate } from "utils/formatDate";
import toTitleCase from "utils/toTitleCase";

const PostDetails = ({ post, updateTask, handleDownload, canEdit = false }) => (
  <div>
    <div className="flex flex-col gap-y-8">
      <div className="flex space-x-2">
        {post.categories.map(category => (
          <Tag key={category.id}>{category.name}</Tag>
        ))}
      </div>
      <div className="flex w-full items-start justify-between gap-x-6">
        <div className="flex items-start space-x-2">
          <h2 className="text-3xl font-semibold">{post?.title}</h2>
          <Tag
            className="mt-2 px-4"
            label={toTitleCase(post.status)}
            style={post.status === "draft" ? "danger" : "success"}
          />
        </div>
        <div className="flex items-center justify-end gap-x-3">
          <Button
            icon={Download}
            size="large"
            style="tertiary"
            tooltipProps={{
              content: "Download blog report",
              position: "top",
            }}
            onClick={() => handleDownload(post.slug)}
          />
          {canEdit() && (
            <Button
              icon={Edit}
              size="large"
              style="tetiary"
              tooltipProps={{
                content: "Edit",
                position: "top",
              }}
              onClick={updateTask}
            />
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <Profile />
        <div className="text-sm text-gray-500">
          <p>{post?.user?.name}</p>
          <p>{formatDate(post.updated_at)}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500">{post?.description}</p>
    </div>
  </div>
);

export default PostDetails;
