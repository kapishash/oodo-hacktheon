import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/NavBar";


// Example categories; replace or fetch as needed
const categories = ["Electronics", "Clothing", "Books", "Home", "Other"];

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (!name || !category || !description || !price) {
      setError("All fields except image are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/products/add_product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          category,
          description,
          image,
          price: Number(price),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to add product.");
        setLoading(false);
        return;
      }

      toast.success("Product added successfully!");
      setName("");
      setCategory(categories[0]);
      setDescription("");
      setImage("");
      setPrice("");
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-100 py-10">
      <ToastContainer />
      <div className="card w-full max-w-lg bg-white shadow-xl p-8">
        <h2 className="text-3xl font-semibold mb-8 text-center text-green-800">
          Add a New Product
        </h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="input input-bordered w-full text-white-900"
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">Category</label>
            <select
              className="select select-bordered w-full text-white-900"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">Description</label>
            <textarea
              className="textarea textarea-bordered w-full text-white-900"
              placeholder="Product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              className="input input-bordered w-full text-white-900"
              placeholder="https://example.com/image.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              className="input input-bordered w-full text-white-900"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={0}
              required
            />
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
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/dashboard" className="text-green-700 underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
