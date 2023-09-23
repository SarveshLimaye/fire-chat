import React from "react";

interface User {
  id: string;
  name?: string;
}

interface UserListItemProps {
  user: User;
  isOnline: boolean;
}

const UserListItem = ({ user, isOnline }): UserListItemProps => {
  return (
    <li className="flex items-center bg-white p-2 mb-2 rounded shadow">
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {isOnline && (
            <div className="w-4 h-4 bg-green-300 rounded-full"></div>
          )}
        </div>
        <div className="ml-2">
          <h3 className="text-lg font-semibold">
            {user.name || "Placeholder Name"}
          </h3>
          <p className={isOnline ? "text-green-600" : "text-gray-500"}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </li>
  );
};

export default UserListItem;
