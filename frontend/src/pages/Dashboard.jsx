import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import Carousel from "../components/Courousal";

const categories = ["All", "Electronics", "Clothing", "Books", "Home", "Other"];

export default function DashboardPage() {
  const [products, setProducts] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch products from backend with search and filter
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      // Build query params
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category && category !== "All") params.append("category", category);

      const response = await fetch(`/api/products?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      const productsByCategory = data.reduce((acc, curr) => {
        const category = curr.category || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(curr);
        return acc;
      }, {});
      setProducts(productsByCategory);
    } catch (err) {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [search, category]);

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-base-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-green-800">Home</h1>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              className="input input-bordered flex-1"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="select select-bordered w-full md:w-48"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button className="btn btn-primary">
              <Link to="/add_product">Add Product</Link> </button>
          </div>
          <Carousel />

          {/* Loading/Error */}
          {loading && (
            <div className="flex justify-center my-10">
              <span className="loading loading-spinner loading-lg text-green-600"></span>
            </div>
          )}
          {error && (
            <div className="alert alert-error mb-4">{error}</div>
          )}

          {/* Product List */}
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(products).map(([categoryName, categoryProducts]) => (
              <div key={categoryName} className="col-span-full">
                <h2 className="text-2xl font-bold mb-4">{categoryName}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((product) => (
                    <Link
                      to={`/product/${product._id}`}
                      key={product._id}
                      className="card bg-white shadow-md hover:shadow-xl transition-shadow"
                    >
                      <figure className="bg-base-200 h-48 flex items-center justify-center">
                        {product.imagePlaceholder ? (
                          <img
                            src={product.imagePlaceholder}
                            alt={product.title}
                            className="object-contain h-40"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title text-green-800">{product.title}</h2>
                        <p className="text-gray-600 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="badge badge-outline">{product.category}</span>
                          <span className="font-bold text-green-700">₹{product.price}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

