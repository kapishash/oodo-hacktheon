import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      toast.success("Registration successful! Please login.");
      navigate("/")

      // setName("");
      // setEmail("");
      // setPassword("");
      // setConfirmPassword("");
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-100">
      <ToastContainer />
      <div className="card w-full max-w-md bg-white shadow-xl p-8">
        <h2 className="text-3xl font-semibold mb-8 text-center text-green-800">
          Create your EcoFinds Account
        </h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
              Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                className="w-full outline-none bg-transparent text-gray-900"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                className="w-full outline-none bg-transparent text-gray-900"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="w-full outline-none bg-transparent text-gray-900"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full outline-none bg-transparent text-gray-900"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : null}
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="text-center text-gray-800 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-green-700 underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
