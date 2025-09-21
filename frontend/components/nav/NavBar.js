import React from 'react'

const NavBar = () => {
  return (
    <div className="bg-black text-white flex items-center justify-between p-3">
      {/* Logo */}
      <div className="font-bold text-xl">ECOMMERCE</div>

      {/* Links */}
      <div className="hidden md:flex gap-6 p-2">
        <div className="cursor-pointer hover:text-amber-300">Home</div>
        <div className="cursor-pointer hover:text-amber-300">About</div>
        <div className="cursor-pointer hover:text-amber-300">Contact</div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white rounded-md max-w-md w-full mx-4">
        <input
          type="text"
          className="p-2 text-black w-full rounded-l-md outline-none"
          placeholder="Search product..."
        />
        <button
          className="bg-amber-300 p-2 px-4 text-black rounded-r-md"
          aria-label="Search"
        >
          🔍
        </button>
      </div>

      {/* Cart + Login */}
      <div className="flex items-center gap-4">
        <div className="text-2xl cursor-pointer">🛒</div>
        <div className="cursor-pointer hover:text-amber-300">Login</div>
      </div>
    </div>
  )
}

export default NavBar
