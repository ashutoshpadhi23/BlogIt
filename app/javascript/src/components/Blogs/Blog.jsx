import React, { useState } from "react";

import { UpArrow, DownArrow } from "@bigbinary/neeto-icons";
import postApi from "apis/posts";
import classNames from "classnames";
import { Tag, Button } from "neetoui";

const Blog = ({ title, date, showBlog, blog }) => {
  const [votes, setVotes] = useState({
    upvotes: blog.upvotes,
    downvotes: blog.downvotes,
    net: blog.upvotes - blog.downvotes,
    is_bloggable: blog.is_bloggable,
    current_user_vote: blog.current_user_vote,
  });

  const handleVote = async type => {
    const vote_type = votes.current_user_vote === type ? null : type;
    const { data } = await postApi.vote(blog.slug, { vote_type });

    setVotes({
      upvotes: data.upvotes,
      downvotes: data.downvotes,
      net: data.upvotes - data.downvotes,
      is_bloggable: data.is_bloggable,
      current_user_vote: data.current_user_vote,
    });
  };

  return (
    <div className="mt-6 w-full space-y-4 border-b-2 border-gray-200 pb-2">
      <div
        className="flex cursor-pointer items-center space-x-2 text-2xl font-bold "
        onClick={() => showBlog(blog.slug)}
      >
        {title}
        <div className="mb-1 ml-2">
          {votes.is_bloggable && <Tag label="Blog it" style="success" />}
        </div>
      </div>
      <div className=" flex justify-start space-x-2 text-sm">
        {blog.categories.map(category => (
          <Tag key={category.id}>{category.name}</Tag>
        ))}
      </div>
      <div className="space-y-2">
        <div className="text-md font-bold">{blog?.user?.name}</div>
        <div className="text-xs font-medium text-gray-600">{date}</div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          icon={UpArrow}
          style="secondary"
          className={classNames({
            "bg-green-600 text-white hover:bg-green-700 focus:shadow":
              votes.current_user_vote === "upvote",
          })}
          onClick={() => handleVote("upvote")}
        />
        <span>{votes.net}</span>
        <Button
          icon={DownArrow}
          style="secondary"
          className={classNames({
            "bg-red-600 text-white hover:bg-red-700 focus:shadow":
              votes.current_user_vote === "downvote",
          })}
          onClick={() => handleVote("downvote")}
        />
      </div>
    </div>
  );
};

export default Blog;
