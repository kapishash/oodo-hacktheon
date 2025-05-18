import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/NavBar";


export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingProductId, setRemovingProductId] = useState(null);

  // Fetch cart items
  const fetchCart = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/users/cart', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch cart.');
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError('Could not load cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    setRemovingProductId(productId);
    try {
      const response = await fetch(`/api/user/cart/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to remove item.');
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError('Could not remove item.');
    } finally {
      setRemovingProductId(null);
    }
  };

  // Calculate total price
  const total = cart.reduce((sum, product) => sum + (product.price || 0), 0);

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
    <Navbar />
    <div className="min-h-screen bg-base-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="text-gray-500 mb-6 text-center">
            Your cart is empty.
            <div className="mt-4">
              <Link to="/dashboard" className="btn btn-primary">
                Go to Marketplace
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {cart.map((product) => (
                <div key={product._id} className="card bg-base-100 shadow p-4 flex flex-col">
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
                    <span className="font-bold text-green-700">Rs.{product.price}</span>
                  </div>
                  <button
                    className="btn btn-error btn-sm mt-2"
                    onClick={() => handleRemove(product._id)}
                    disabled={removingProductId === product._id}
                  >
                    {removingProductId === product._id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <div className="text-xl font-semibold">Total:</div>
              <div className="text-2xl font-bold text-green-700">Rs.{total}</div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="btn btn-success"
                onClick={() => {
                  alert('Proceeding to checkout!');
                }}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}
