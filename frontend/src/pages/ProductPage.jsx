import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch product.");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError("Product not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setCartMessage("");
    try {
      const response = await fetch("/api/users/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: id }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add to cart.");
      }
      setCartMessage("Product added to cart successfully!");
    } catch (err) {
      setCartMessage(err.message || "Failed to add to cart.");
    } finally {
      setAddingToCart(false);
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
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="alert alert-error mb-4">{error}</div>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex flex-col items-center bg-base-100 py-10 px-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-0 md:p-6 flex flex-col md:flex-row">
        {/* Left Side: Image, Category, Price */}
        <div className="md:w-1/2 w-full p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-base-200">
          <div className="aspect-video w-full bg-base-200 rounded-lg flex items-center justify-center overflow-hidden mb-4">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
          <span className="badge badge-outline mb-2">{product.category}</span>
          <div className="text-2xl font-bold text-green-700 mb-4">
            ₹{product.price}
          </div>
          <button
            className="btn btn-success w-full"
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? "Adding..." : "Add to Cart"}
          </button>
          {cartMessage && (
            <div className="mt-2 text-center text-sm text-green-700">
              {cartMessage}
            </div>
          )}
        </div>


        <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
          <Link to="/dashboard" className="btn btn-ghost mb-4 w-fit">
            &larr; Back to Marketplace
          </Link>
          <h1 className="text-3xl font-bold text-green-800 mb-2">{product.name}</h1>
          <p className="text-gray-700 mb-6">{product.description}</p>

        </div>
      </div>
    </div>
    </>
  );
}
