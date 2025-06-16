import React from "react";

const Blog = ({ title, description, date, showBlog, blog }) => (
  <div className="mt-6 w-full space-y-4 border-b-2 border-gray-200 pb-2">
    <div
      className="cursor-pointer text-2xl font-bold "
      onClick={() => showBlog(blog.slug)}
    >
      {title}
    </div>
    <div className=" flex justify-start space-x-2 text-sm">
      {blog.categories.map(category => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
    <div className="space-y-2">
      <div className="text-md line-clamp-2 w-4/5 break-words text-gray-700">
        {description}
      </div>
      <div className="text-xs">{blog?.user?.name}</div>
      <div className="text-xs font-medium text-gray-600">{date}</div>
    </div>
  </div>
);

export default Blog;
