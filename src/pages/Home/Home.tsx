import React from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { update, ref } from "firebase/database";

export default function Home() {
  const handleSignout = async () => {
    await update(ref(db, `users/${auth.currentUser.uid}`), {
      isOnline: false,
    });
    await signOut(auth);
    console.log("Signed out");
  };
  return (
    <>
      <div>Home</div>{" "}
      <button className="btn" onClick={handleSignout}>
        Logout
      </button>
    </>
  );
}
