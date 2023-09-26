import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { signOut } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { update, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // Added state to control profile display
  const [name, setName] = useState("");
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

  const handleMouseEnter = async () => {
    if (auth.currentUser) {
      onValue(ref(db, `users/${auth.currentUser.uid}`), (snapshot) => {
        const data = snapshot.val();
        setName(data.name);
      });
      setShowProfile(true);
    }
  };

  return (
    <>
      <nav className="bg-violet-500 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex justify-between items-center">
            <Link
              className="text-white text-lg font-bold leading-relaxed uppercase"
              to="/"
            >
              FireChat
            </Link>
            <button
              className="lg:hidden text-white text-xl leading-none px-3 py-1 border rounded bg-transparent outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <img
                src="https://www.clipartmax.com/png/full/36-365828_navbar-toggle-icon-menu-hamburger-png-white.png"
                alt="Menu"
                className="w-8 h-6"
              />
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center relative" +
              (navbarOpen ? " flex" : " hidden")
            }
          >
            {user ? (
              <ul className="lg:flex flex-col lg:flex-row list-none ml-auto">
                <li className="nav-item relative">
                  <div
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 cursor-pointer"
                    onClick={handleSignout}
                  >
                    <span className="ml-2">Logout</span>
                  </div>
                </li>
                <li
                  className="nav-item relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={() => setShowProfile(false)}
                >
                  <div className="px-3 py-2 flex items-center text-xs font-bold leading-snug text-white cursor-pointer">
                    <span className="ml-2 uppercase">Profile</span>
                    {showProfile && (
                      <div className="absolute top-full left-0 bg-white text-black mt-2 p-2 rounded shadow">
                        <p>
                          {" "}
                          Welcome <strong>{name}</strong>
                        </p>
                        <br />
                        <p>{user.email}</p>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            ) : (
              <ul className="lg:flex flex-col lg:flex-row list-none ml-auto">
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
