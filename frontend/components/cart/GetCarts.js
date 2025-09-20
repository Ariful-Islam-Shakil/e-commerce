import { useRepo } from '@/context/RepoContext';
import { listCarts, removeCartItem, updateCartItem } from '@/lib/cart_routes';
import React, { useEffect, useState } from 'react'

const GetCarts = () => {
    const {accessToken, setAccessToken} = useRepo()
    const [carts, setCarts] = useState([])
    useEffect(()=>{
        const fetchCarts = async ()=>{
            try{ 
                const response = await listCarts(accessToken);
                console.log("Cart Response: ",response.items);
                setCarts(response.items);
            }catch(error){
                console.log(error)
            }
        };
        fetchCarts();
    }, [accessToken]);

    const handleRemoveItem = async (cartID)=>{
        try{
            const response = await removeCartItem(accessToken, cartID);
            console.log("Item removed: ", response);
            setCarts(response.items);
        }catch(error){
            console.log("Error removing item: ", error)
        }
    }
    const handleUpdateCart = async (productId, quantity)=>{
        try{
            const response = await updateCartItem(accessToken, productId, quantity);
            setCarts(response.items);
        }catch(error){
            console.log("Error updating cart item")
        }
    }

  return (
    <div>Cart list
        {carts.map((cart)=>(
            <div key={cart.id} className='border-2 m-2 p-2'>
                <ul>
                    <li>Id: {cart.id}</li>
                    <li>Product ID: {cart.product_id}</li>
                    <li>Quantity : {cart.quantity}</li>
                    <button
                        className='bg-red-500 text-white p-2 rounded-lg mt-2'
                        onClick={() => handleRemoveItem(cart.product_id)}
                    >Remove item</button>
                    <button
                    className='bg-red-500 text-white p-2 mt-2 rounded-full'
                        onClick={()=> handleUpdateCart(cart.product_id, cart.quantity - 1)}
                    > - </button>
                    <button
                        className='bg-red-500 text-white p-2 mt-2 rounded-full'
                        onClick={()=> handleUpdateCart(cart.product_id, cart.quantity + 1)}
                    > + </button>
                </ul>
            
            </div>
        ))}
    </div>
  )
}

export default GetCarts