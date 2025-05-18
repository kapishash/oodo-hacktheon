import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important to send cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }else {
        navigate("/dashboard")
      }

      
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Project illustration and description */}
      <div className="md:w-1/2 bg-green-100 flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-6 text-green-800 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13h2v6h-2zm0 8h2v2h-2z"
            />
          </svg>
          EcoFinds
        </h1>
        <p className="text-lg mb-6 text-green-700 max-w-md text-center">
          Empowering Sustainable Consumption through a Second-Hand Marketplace.<br />
          Discover unique pre-owned items and contribute to a circular economy.
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          className="w-48 h-48 text-green-500"
        >
          <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="4" fill="white" />
          <path
            d="M32 12c-8 0-14 7-14 14 0 7 6 14 14 14s14-7 14-14c0-7-6-14-14-14zm0 24a10 10 0 110-20 10 10 0 010 20z"
            fill="currentColor"
            opacity="0.2"
          />
          <path
            d="M32 24v8m0 0l4-4m-4 4l-4-4"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Right side: Login form */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-10 bg-white">
        <h2 className="text-3xl font-semibold mb-8 text-green-800">Login to EcoFinds</h2>
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full outline-none bg-transparent text-gray-900"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full outline-none bg-transparent text-gray-900"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}