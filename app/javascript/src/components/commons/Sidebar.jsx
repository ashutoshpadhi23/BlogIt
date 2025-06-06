import React from "react";

import { Book, List } from "@bigbinary/neeto-icons";
import classNames from "classnames";
import { useLocation, Link } from "react-router-dom";

import Profile from "./Profile";

import { routes } from "../../constants/routes";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex w-16 flex-col items-center justify-start gap-y-4 border-r-4 border-gray-200 py-6">
      <div className="mt-6 flex h-8 w-8 items-center justify-center rounded-md bg-black text-white ">
        <Link to={routes.blogs}>
          <Book className="cursor-pointer" size={24} />
        </Link>
      </div>
      <div>
        <Link to={routes.blogs}>
          <List
            size={24}
            className={classNames(
              "flex h-8  w-8  cursor-pointer items-center justify-center rounded-md  p-1  hover:bg-gray-600 hover:text-white",
              { "bg-black text-white": location.pathname === routes.blogs }
            )}
          />
        </Link>
      </div>
      <div className="mt-auto">
        <Profile />
      </div>
    </div>
  );
};

export default Sidebar;
