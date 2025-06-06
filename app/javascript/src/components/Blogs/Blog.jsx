import React from "react";

const Blog = ({ title, description, date }) => (
  <div className="mt-6 w-full space-y-4 border-b-2 border-gray-200 pb-2">
    <div className="text-2xl font-bold">{title}</div>
    <div className="space-y-2">
      <div className="text-md line-clamp-2 w-4/5 break-words text-gray-700">
        {description}
      </div>
      <div className="text-xs font-medium text-gray-600">{date}</div>
    </div>
  </div>
);

export default Blog;
