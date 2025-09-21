import { useRepo } from '@/context/RepoContext';
import { addToCart } from '@/lib/cart_routes';
import { listProducts } from '@/lib/product_routes';
import React, { useEffect, useState } from 'react'
import ProductCart from './ProductCart';

const AllProducts = () => {
    const [productsList, setProductsList] = useState([]);
    const {accessToken} = useRepo()
    useEffect(()=>{
        const fetchProductsList = async ()=>{
            try{
                const response = await listProducts();
                setProductsList(response);
                console.log(response)
            }catch(error){
                console.log(error);
            }
        };
        fetchProductsList();
    }, [])
    const handleAddToCart = async (productID) => {
        const cartItem = {
            product_id: productID,
            quantity: 1
        }
        try{
            const response = await addToCart(accessToken, cartItem);
            console.log("Product added to cart: ", response)
        }catch(error){
            console.log("Error adding to cart: ", error)
        }
    }

  return (
    <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productsList.map((product) => (
            // <div key={product.id} className='border-2 m-2 p-2'>
            //     <ul>
            //         <li>Product Name: {product.name}</li>
            //         <li>Price: ${product.price}</li>
            //         <li>Description: {product.description}</li>
            //         <button 
            //             className='bg-blue-500 text-white p-2 rounded-lg mt-2'
            //             onClick={() => handleAddToCart(product.id)}
            //         >
            //             Add to Cart
            //         </button>
            //     </ul>
                
            // </div>
            <ProductCart key={product.id} product={product} handleAddToCart={handleAddToCart}/>
                    ))};
    </div>
  )
}

export default AllProducts