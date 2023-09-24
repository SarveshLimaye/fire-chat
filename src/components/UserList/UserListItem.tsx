import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { ref, onValue } from "firebase/database";

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

const UserListItem = ({
  user,
  isOnline,
  selectUser,
  user1,
}): UserListItemProps => {
  const [newmsg, setnewmsg] = useState({});

  const [msgid, setmsgid] = useState("");
  const user2 = user.uid;

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    setmsgid(id);

    const getLatestmsg = () => {
      const msgref = ref(db, "lastmsg", id);
      onValue(msgref, (snapshot) => {
        const data = snapshot.val();
        setnewmsg(data);
      });
    };
    getLatestmsg();
  }, []);

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
          {newmsg === null
            ? null
            : user1 === newmsg[msgid]?.to && <p>{newmsg[msgid]?.text}</p>}
        </div>

        {newmsg !== null &&
        user1 === newmsg[msgid]?.to &&
        newmsg[msgid]?.read === false ? (
          <small className="ml-2 text-white py-[2px] px-[6px] bg-green-400 rounded-lg justify-end">
            New
          </small>
        ) : null}
      </div>
    </li>
  );
};

export default UserListItem;
