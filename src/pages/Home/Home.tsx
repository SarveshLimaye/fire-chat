import { useEffect, useState } from "react";
import { db, auth } from "../../utils/firebase";
import {
  ref,
  onValue,
  set,
  push,
  orderByChild,
  update,
  query,
} from "firebase/database";
import { Timestamp } from "firebase/firestore";
import UserListItem from "../../components/UserList/UserListItem";
import MessageCard from "../../components/Message/MessageCard.tsx";
import MessageForm from "../../components/MessageForm/MessageForm";

export default function Home() {
  const [users, setUsers] = useState<{ [key: string]: any }>({});
  const [msg, setMsgs] = useState<{ [key: string]: any }>({});
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null); // Update the initial type
  const [text, setText] = useState<string>("");
  const user1 = auth.currentUser?.uid || ""; // Provide a default value for user1

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
  const selectUser = async (user: any) => {
    setSelectedUser(user);
    setSelectedName(user.name);
    const user2 = user.uid;
    const id: string = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgref = ref(db, "messages/" + id + "/chats");
    const ascmessages = query(msgref, orderByChild("createdAt/nanoseconds"));
    onValue(ascmessages, (snapshot) => {
      const data = snapshot.val();
      setMsgs(data);
    });

    let obj = {};
    onValue(ref(db, `lastmsg/${id}`), (snapshot) => {
      const data = snapshot.val();
      console.log(data);

      obj = data;
    });
    console.log(obj);

    if (obj && "from" in obj && obj.from !== user1) {
      const newref = ref(db, `lastmsg/${id}`);
      await update(newref, {
        read: true,
      });
      let chatid;
      if (obj && "chatid" in obj) {
        chatid = obj.chatid;
        // Your code here
      }
      await update(ref(db, `messages/${id}/chats/${chatid}`), {
        read: true,
      });
    }
  };

  const msgarray = msg === null ? [] : Object.values(msg);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const user2 = selectedUser.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const msgref = ref(db, "messages/" + id + "/chats");
    const newmsgref = push(msgref);
    console.log();

    const chatid: string | null = newmsgref.key;
    console.log(chatid);

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
      chatid: chatid,
      read: false,
    });

    await update(ref(db, `messages/${id}/chats/${chatid}`), {
      sent: true,
    });
    setText("");
  };

  return (
    <>
      <div className="messenger pl-4 pb-4 bg-white h-screen overflow-hidden">
        <div className="flex">
          <div className="basis-2/6 pt-3 bg-white border-r border-slate-100">
            <div>
              <h2 className="text-xl font-semibold mb-4">User List</h2>
            </div>
            <div className="user-list overflow-y-auto h-screen bg-white">
              <h3 className="text-lg font-semibold mb-2">Online Users</h3>
              <ul>
                {onlineUsers.map((user) => (
                  <UserListItem
                    key={user.id}
                    user={user}
                    isOnline={true}
                    selectUser={selectUser}
                    user1={user1}
                  />
                ))}
              </ul>
              <h3 className="text-lg font-semibold mt-4 mb-2">Offline Users</h3>
              <ul>
                {offlineUsers.map((user) => (
                  <UserListItem
                    key={user.id}
                    user={user}
                    isOnline={false}
                    selectUser={selectUser}
                    user1={user1}
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className="basis-4/6">
            <div>
              <div className="bg-slate-100 user-info-header px-5 py-3">
                {selectedName ? (
                  <h2 className="text-xl font-semibold text-center">
                    {selectedName}
                  </h2>
                ) : null}
              </div>
              {selectedName ? (
                <div className="message-area mt-4 px-4 max-h-[70vh] overflow-y-auto">
                  {msgarray.map((item) => (
                    <MessageCard
                      key={item.id}
                      text={item.text}
                      from={item.from}
                      user1={user1}
                      sent={item.sent}
                      serverReceived={item.serverReceived}
                      read={item.read}
                    />
                  ))}
                </div>
              ) : (
                <h3> Select an user to continue </h3>
              )}
            </div>

            {selectedName ? (
              <div>
                <MessageForm
                  text={text}
                  setText={setText}
                  handleSubmit={handleSubmit}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
