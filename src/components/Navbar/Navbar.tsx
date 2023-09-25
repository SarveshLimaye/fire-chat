import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { signOut } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { update, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSignout = async () => {
    if (auth.currentUser) {
      await update(ref(db, `users/${auth.currentUser.uid}`), {
        isOnline: false,
      });
      await signOut(auth);
      navigate("/login");
      console.log("Signed out");
    }
  };

  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-violet-500 mb-0">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              className="text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
              to="/"
            >
              FireChat
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <img
                src="https://www.clipartmax.com/png/full/36-365828_navbar-toggle-icon-menu-hamburger-png-white.png"
                alt="hh"
                className="w-8 h-6"
              />
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            {user ? (
              <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                <li className="nav-item">
                  <div
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    onClick={handleSignout}
                  >
                    <span className="ml-2">Logout</span>
                  </div>
                </li>
              </ul>
            ) : (
              <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                <li className="nav-item">
                  <Link
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    to="/login"
                  >
                    <span className="ml-2">Login</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    to="/register"
                  >
                    <span className="ml-2">Register</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
