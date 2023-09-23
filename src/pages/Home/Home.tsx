import React, { useEffect, useState } from "react";
import { db, auth } from "../../utils/firebase";
import { ref, onValue, set, push } from "firebase/database";
import { Timestamp } from "firebase/firestore";
import UserListItem from "../../components/UserList/UserListItem";
import MessageForm from "../../components/MessageForm/MessageForm";

export default function Home() {
  const [users, setUsers] = useState({});
  const [selectedName, setSelectedName] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [text, setText] = useState("");
  const user1 = auth.currentUser.uid;

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
  const selectUser = (user) => {
    setSelectedUser(user);
    setSelectedName(user.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user2 = selectedUser.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    console.log(id);
    const msgref = ref(db, "messages/" + id + "/chats");
    const newmsgref = push(msgref);
    await set(newmsgref, {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      serverReceived: true,
      sent: false,
      read: false,
    });

    await set(ref(db, "lastmsg/" + id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      serverReceived: true,
      sent: true,
      read: false,
    });

    setText("");
  };

  return (
    <>
      <div className="flex h-screen">
        <div className="w-1/2 bg-gray-100 p-4">
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          <div>
            <h3 className="text-lg font-semibold mb-2">Online Users</h3>
            <ul>
              {onlineUsers.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  isOnline={true}
                  selectUser={selectUser}
                />
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mt-4 mb-2">Offline Users</h3>
            <ul>
              {offlineUsers.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  isOnline={false}
                  selectUser={selectUser}
                />
              ))}
            </ul>
          </div>
        </div>
        <div className="w-1/2 bg-white flex flex-col justify-between h-full">
          {selectedName ? (
            <>
              <div className="bg-gray-100 py-2  ">
                <h2 className="text-xl font-semibold text-center">
                  {selectedName}
                </h2>
              </div>
              <MessageForm
                text={text}
                setText={setText}
                handleSubmit={handleSubmit}
              />
            </>
          ) : (
            <h3> Select a user to start conversation</h3>
          )}

          {/* Chat text input and send button */}
        </div>
      </div>
    </>
  );
}
