import React from "react";

import { Table } from "antd";

const PostsTable = ({ data, columns, rowSelection }) => (
  <div className="p-4">
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      rowSelection={rowSelection}
    />
  </div>
);

export default PostsTable;
