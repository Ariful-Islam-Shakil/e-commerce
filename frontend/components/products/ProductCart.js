import React from 'react'

const ProductCart = ({ product, handleAddToCart }) => {
  return (
    <div className="w-full sm:max-w-sm border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition">
      {/* Product Image (placeholder for now) */}
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-4">
        <span className="text-gray-500">Product Image</span>
      </div>

      {/* Product Info */}
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h2>
      <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Color:</span> Red</p>
      <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Brand:</span> EconoFX</p>
      <p className="text-sm text-gray-600 mb-3">
        <span className="font-medium">Description:</span>  
        {product.description}
      </p>

      {/* Price & Add to Cart */}
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-amber-600">৳{product.price}</span>
        <button className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
         onClick={() => handleAddToCart(product.id)} // Still Unauthorized, need to work later 
        >
          Add to Cart 🛒
        </button>
      </div>
    </div>
  )
}

export default ProductCart