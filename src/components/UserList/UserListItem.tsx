import React from "react";

interface User {
  uid: string;
  name?: string;
  email: string;
  isOnline: boolean;
}

interface UserListItemProps {
  user: User;
  isOnline: boolean;
  selectUser: (userId: string) => void;
}

const UserListItem = ({ user, isOnline, selectUser }): UserListItemProps => {
  return (
    <li
      className="flex items-center bg-white p-2 mb-2 rounded shadow"
      onClick={() => selectUser(user)}
    >
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
