import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import Navbar from "../components/NavBar";
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/users/profile", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to load profile.");
        const data = await response.json();
        setUser(data);
        setName(data.name || "");
      } catch (err) {
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Handle save
  const handleSave = async () => {
  setSaving(true);
  setError("");
  try {
    const response = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Failed to update profile.");
    const data = await response.json();
    setUser(data);
    setEdit(false);
    toast.success("Username changed successfully!"); // Toast notification
  } catch (err) {
    setError("Failed to update profile.");
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-green-600"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer/>
      <div className="flex flex-col items-center py-10 min-h-screen bg-base-100">
        <div className="card w-full max-w-md bg-white shadow-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="avatar mb-4">
              <div className="w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-green-700" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              {edit ? (
                <input
                  className="input input-bordered w-full max-w-xs text-center"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                />
              ) : (
                user.name || <span className="italic text-gray-400">No username</span>
              )}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {edit ? (
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="btn btn-success"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setName(user.name || "");
                  setEdit(false);
                }}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-center mt-4">
              <button className="btn btn-primary" onClick={() => setEdit(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
