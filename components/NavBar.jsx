"use client";
import { useEffect, useState, useContext } from "react";
import { TrackingContext } from "@/context/TrackingContext";
import { Nav1, Nav2, Nav3 } from "@/components/page";

export default function Navbar() {
  const [state, setState] = useState(false);
  const { currentUser, connectWallet } = useContext(TrackingContext);

  const navigation = [
    { title: "Home", path: "/" },
    { title: "Services", path: "/services" },
    { title: "Contact Us", path: "/contactus" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      // Check if the click is *not* inside the menu or the menu button
      if (!target.closest(".navbar") && !target.closest(".menu-btn")) {
        // Added .navbar to the conditional
        setState(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Use mousedown

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [state]); // Add state to the dependency array

  return (
    <nav className="bg-white py-3 md:pb-5 md:text-sm navbar">
      {/* Added navbar class for handleClickOutside */}
      <div className="max-w-screen-xl mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="flex items-center gap-x-2"
          >
            <img
              src="/logo.jpg"
              width={100}
              height={40}
              alt="Supply Chain Tracker logo"
            />
            <span className="font-bold text-black text-xl md:text-2xl">
              Supply Chain Tracker
            </span>
          </button>

          <div className="md:hidden">
            {/* Hamburger menu button */}
            <button
              className="menu-btn text-gray-500 hover:text-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Hamburger menu clicked! State is:", state);
                setState(!state);
              }}
            >
              {state ? <Nav1 /> : <Nav2 />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (Conditional Rendering) */}
        <div
          className={`mt-4 ${
            state ? "block" : "hidden"
          } md:hidden`} // Only show on mobile
        >
          <ul className="flex flex-col space-y-2">
            {navigation.map((item, idx) => (
              <li key={idx} className="text-gray-700 hover:text-gray-900">
                <a href={item.path} className="block py-2">
                  {item.title}
                </a>
              </li>
            ))}
            <li className="mt-4">
              {currentUser ? (
                <p className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-black rounded-full">
                  {currentUser.slice(0, 25)}..
                </p>
              ) : (
                <button
                  onClick={() => connectWallet()}
                  className="flex items-center font-bold justify-center gap-x-1 py-2 px-4 text-white bg-black rounded-full"
                >
                  Connect Wallet
                  <Nav3 />
                </button>
              )}
            </li>
          </ul>
        </div>

        {/* Desktop Menu (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 items-center justify-end">
          <ul className="flex space-x-6">
            {navigation.map((item, idx) => (
              <li key={idx} className="text-gray-700 hover:text-gray-900">
                <a href={item.path} className="block">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-8">
            {currentUser ? (
              <p className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-black rounded-full">
                {currentUser.slice(0, 25)}..
              </p>
            ) : (
              <button
                onClick={() => connectWallet()}
                className="flex items-center font-bold justify-center gap-x-1 py-2 px-4 text-white bg-black rounded-full"
              >
                Connect Wallet
                <Nav3 />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}