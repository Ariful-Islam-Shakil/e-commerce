'use client';

import { addPruduct } from '@/lib/product_routes';
import React, { useState } from 'react'

const AddProduct = () => {
    const [newProduct, setNewProduct] = useState({
    "name": "",
    "description": "",
    "price": 0,
    "stock": 0
    })
    const handleChange = (e) =>{
        const {name, value} = e.target;
        setNewProduct({
            ...newProduct,
            [name]: value
        })
    }
    const handleSubmit = async ()=>{
        try{
            const response = await addPruduct(newProduct);
            console.log("Product added successfully: ", response);
            setNewProduct({
                    "name": "",
                    "description": "",
                    "price": 0,
                    "stock": 0
            })
        }catch(error){
            console.log("Error adding product: ", error)
        }
    }

  return (
    <div>
        <div>Add new Product</div>
        <input
        name='name'
        value={newProduct.name}
        placeholder='Enter product name'
        className='border p-2 rounded-lg'
        onChange={handleChange}
        />

        <input
        name='description'
        value={newProduct.description}
        placeholder='Enter product description'
        className='border p-2 rounded-lg'
        onChange={handleChange}
        />
        <input
        name='price'
        value={newProduct.price}
        placeholder='Enter product price'
        className='border p-2 rounded-lg'
        onChange={handleChange}
        />
        
        <input
        name='stock'
        value={newProduct.stock}
        placeholder='Enter total stock'
        className='border p-2 rounded-lg'
        onChange={handleChange}
        />

        <button
            className='bg-blue-500 text-white p-2 rounded-lg mt-2'
            onClick={handleSubmit}
        >
            Add Product
        </button>

    </div>
  )
}

export default AddProduct