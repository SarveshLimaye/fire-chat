import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { update, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

interface LoginData {
  email: string;
  password: string;
  error: string | null;
  loading: boolean;
}

export default function Login() {
  const [data, setData] = useState<LoginData>({
    name: "",
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const navigate = useNavigate();

  const { email, password, error, loading }: LoginData = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: "All fields are required" });
    }
    console.log(data);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      await update(ref(db, `users/${result.user.uid}`), {
        isOnline: true,
      });
      setData({
        email: "",
        password: "",
        error: null,
        loading: false,
      });
      navigate("/");
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-36 w-auto"
          src="data:image/png;base64,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"
          alt="Your Company"
        />
        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {error ? <p className=" text-red-600">{error}</p> : null}
          <div>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {loading ? "Logging in ..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
