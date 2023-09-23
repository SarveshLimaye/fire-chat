import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { ref, onValue } from "firebase/database";
import UserListItem from "../../components/UserList/UserListItem";

export default function Home() {
  const [users, setUsers] = useState({});
  useEffect(() => {
    const getUsers = async () => {
      const userRef = ref(db, "users");
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUsers(data);
      });
    };
    getUsers();
  }, []);

  const userArray = Object.values(users);
  const onlineUsers = userArray.filter((user) => user.isOnline);
  const offlineUsers = userArray.filter((user) => !user.isOnline);

  return (
    <>
      <div className="flex h-screen">
        <div className="w-1/2 bg-gray-100 p-4">
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          <div>
            <h3 className="text-lg font-semibold mb-2">Online Users</h3>
            <ul>
              {onlineUsers.map((user) => (
                <UserListItem key={user.id} user={user} isOnline={true} />
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mt-4 mb-2">Offline Users</h3>
            <ul>
              {offlineUsers.map((user) => (
                <UserListItem key={user.id} user={user} isOnline={false} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
