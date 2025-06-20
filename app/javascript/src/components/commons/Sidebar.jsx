import React, { useEffect, useRef, useState } from "react";

import { Book, List, Edit, Folder, ListDetails } from "@bigbinary/neeto-icons";
import authApi from "apis/auth";
import { resetAuthTokens } from "apis/axios";
import classNames from "classnames";
import { useLocation, Link } from "react-router-dom";
import { getFromLocalStorage, setToLocalStorage } from "utils/storage";

import Profile from "./Profile";

import { routes } from "../../constants/routes";

const Sidebar = () => {
  const location = useLocation();
  const userName = getFromLocalStorage("authUserName");
  const userId = getFromLocalStorage("authUserId");
  const email = getFromLocalStorage("authEmail");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setToLocalStorage({
        authToken: null,
        email: null,
        userId: null,
        userName: null,
      });
      resetAuthTokens();
      window.location.href = "/";
    } catch (error) {
      logger.error(error);
    }
  };

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
      <div>
        <Link to="/blogs/create">
          <Edit
            size={24}
            className={classNames(
              "flex h-8  w-8  cursor-pointer items-center justify-center rounded-md  p-1  hover:bg-gray-600 hover:text-white",
              { "bg-black text-white": location.pathname === "/blogs/create" }
            )}
          />
        </Link>
      </div>
      <div>
        <Link to="/blogs/filter">
          <ListDetails
            size={24}
            className={classNames(
              "flex h-8  w-8  cursor-pointer items-center justify-center rounded-md  p-1  hover:bg-gray-600 hover:text-white",
              { "bg-black text-white": location.pathname === "/blogs/filter" }
            )}
          />
        </Link>
      </div>
      <div>
        <Link to={`blogs/user/${userName}-${userId}`}>
          <Folder
            size={24}
            className={classNames(
              "flex h-8  w-8  cursor-pointer items-center justify-center rounded-md  p-1  hover:bg-gray-600 hover:text-white",
              { "bg-black text-white": location.pathname === "/blogs/filter" }
            )}
          />
        </Link>
      </div>
      <div
        className="relative mt-auto flex flex-col items-center"
        ref={menuRef}
      >
        <div
          className="flex cursor-pointer flex-col items-center"
          onClick={toggleMenu}
        >
          <Profile />
        </div>
        {isMenuVisible && (
          <div className="absolute bottom-2 left-full z-20 ml-3 w-56 rounded-md border border-gray-300 bg-white py-2 shadow-xl">
            <div className="px-4 pb-2 text-left">
              <div className="text-base font-bold text-gray-900">
                {userName}
              </div>
              <div className="text-sm font-medium text-gray-600">{email}</div>
            </div>
            <hr className="my-1" />
            <div
              className="block cursor-pointer px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Log out
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
