import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

const PRODUCTS_PER_PAGE = 10;

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (pageNumber) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/products?limit=${PRODUCTS_PER_PAGE}&page=${pageNumber}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      if (data.length < PRODUCTS_PER_PAGE) {
        setHasMore(false);
      }
      if (pageNumber === 1) {
        setProducts(data);
      } else {
        setProducts((prev) => [...prev, ...data]);
      }
    } catch (err) {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Marketplace</h1>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="card bg-white shadow-md hover:shadow-xl transition-shadow"
            >
              <figure className="bg-base-200 h-48 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain h-40"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </figure>
              <div className="card-body">
                <h2 className="card-title text-green-800">{product.name}</h2>
                <p className="text-gray-600 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="badge badge-outline">{product.category}</span>
                  <span className="font-bold text-green-700">₹{product.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center my-10">
            <span className="loading loading-spinner loading-lg text-green-600"></span>
          </div>
        )}

        {!loading && hasMore && (
          <div className="flex justify-center mt-8">
            <button
              className="btn btn-primary"
              onClick={loadMore}
            >
              Load More
            </button>
          </div>
        )}

        {!hasMore && (
          <div className="text-center mt-8 text-gray-500">
            No more products to show.
          </div>
        )}
      </div>
    </div>
    </>
  );
}
