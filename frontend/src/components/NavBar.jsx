import React from "react";
import { Link, useNavigate} from "react-router-dom";
import {User, ShoppingCart} from "lucide-react";



export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        })

        if (res.ok) {
          navigate("/");
        }else(
          console.log("error")

        )


      } catch (error) {
        console.log(error);
        
      }
    };



  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      {/* Brand/Logo */}
      <div className="flex-1">
        <Link to="/dashboard" className="btn btn-ghost text-xl text-green-700">
          EcoFinds
        </Link>
      </div>

      {/* Nav links (hidden on mobile, shown on md+) */}
      <div className="hidden md:flex gap-2">
        <Link to="/dashboard" className="btn btn-ghost">Home</Link>
        <Link to="/marketplace" className="btn btn-ghost">Marketplace</Link>
        <Link to="/cart" className="btn btn-ghost">
        <ShoppingCart className="w-10 h-10 rounded-full" />
        </Link>
            
          
      </div>

      

      {/* Search bar & Profile dropdown */}
      <div className="flex gap-2 items-center">
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <User className="w-10 h-10 rounded-full" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
                {/* <span className="badge">New</span> */}
              </Link>
            </li>
            {/* <li>
              <Link to="/settings">Settings</Link>
            </li> */}
            <li>
              <button
                onClick={() => {
                  handleLogout();
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Hamburger menu for mobile */}
      <div className="dropdown dropdown-end md:hidden">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[2] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <Link to="/dashboard">Home</Link>
          </li>
          <li>
            <div className="shopping-cart">
            <Link to="/marketplace">Marketplace</Link>
            </div>
          </li>
          <li>
            <Link to="/cart">cart</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <button
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
