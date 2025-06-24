import React from "react";

import { Table } from "neetoui";

const PostsTable = ({ data, columns }) => (
  <div className="p-4">
    <Table
      columnData={columns}
      enableColumnFreeze={false}
      enableColumnResize={false}
      rowData={data}
    />
  </div>
);

export default PostsTable;
