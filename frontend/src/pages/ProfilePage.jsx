import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/NavBar";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const navigate = useNavigate();

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

  // Fetch products created by current user
  useEffect(() => {
    async function fetchUserProducts() {
      setProductLoading(true);
      try {
        const response = await fetch("/api/products/user", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to load products.");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        // Optionally handle error
      } finally {
        setProductLoading(false);
      }
    }
    fetchUserProducts();
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
      toast.success("Username changed successfully!");
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete product.");
      setProducts(products.filter((p) => p._id !== productId));
      toast.success("Product deleted!");
    } catch (err) {
      toast.error("Could not delete product.");
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
      <ToastContainer />
      <div className="flex flex-col items-center py-10 min-h-screen bg-base-100">
        <div className="card w-full max-w-md bg-white shadow-xl p-8 mb-10">
          <div className="flex flex-col items-center mb-6">
            <div className="avatar mb-4">
              <div className="w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-green-700" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              {edit ? (
                <input
                  className="input input-bordered w-full max-w-xs text-center text-white-900"
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
                className="btn btn-secondary"
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

        <div className="w-full max-w-2xl">
          <h3 className="text-xl font-bold mb-4 text-green-800">Your Products</h3>
          {productLoading ? (
            <div className="flex justify-center my-8">
              <span className="loading loading-spinner loading-md text-green-600"></span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-gray-500 text-center mb-8">You have not created any products yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product._id} className="card bg-white shadow p-4">
                  <div className="aspect-video bg-base-200 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <h4 className="font-bold text-lg mb-1">{product.name}</h4>
                  <div className="text-gray-600 mb-2 line-clamp-2">{product.description}</div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="badge badge-outline">{product.category}</span>
                    <span className="font-bold text-green-700">₹{product.price}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate(`/edit-product/${product._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
