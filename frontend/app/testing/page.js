'use client';
import Login from '@/components/auth/Login';
import GetCarts from '@/components/cart/GetCarts';
import AddProduct from '@/components/products/AddProduct';
import AllProducts from '@/components/products/AllProducts';
import RegisterUser from '@/components/RegisterUser';
import User from '@/components/User';
import Users from '@/components/Users';
import { useRepo } from '@/context/RepoContext';
import { clearCart } from '@/lib/cart_routes';
import React from 'react'

const page = () => {
  const {temp, setTemp, accessToken} = useRepo();
  const [getCurtStatus, setGetCartStatus] = React.useState(false);
  const handleClearCart = async ()=>{

    try{
      const response = await clearCart(accessToken);
    }catch(error){
      console.log("error clearing cart: ", error)
    }
  };
  
  return (
    <div>
      <div className='border p-2 rounded-lg'> Login First
        <hr/>
        <Login/>
        <hr/>
      </div>
      <button
        className='bg-blue-500 text-white p-2 rounded-lg m-2'
        onClick={()=>{
          setGetCartStatus(!getCurtStatus);}}
        >
        Get Carts
      </button>
      {getCurtStatus && (
        <div>
          <button
            className='bg-red-500 text-white p-2 rounded-lg m-2'
            onClick={handleClearCart}
          >Clear cart</button>

          <GetCarts/>
        </div>
      )}
 
      <br/>
      <hr/>
      <hr/>
      
      page: {temp} <br/>
      <Users/>
      <User/>
      <RegisterUser/>
      <AddProduct/>
      <AllProducts/>
    
    </div>
  )
}
export default page