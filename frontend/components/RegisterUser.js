'use client';
import { createUser } from '@/lib/user_routes'
import React, { useState } from 'react'

const RegisterUser = () => {
    const [newUser, setNewUser] = useState({
        "email": '',
        "password": '',
        "full_name": ''
    })
    const handleChange = (e) =>{
        const {name, value} = e.target;
        setNewUser({
            ...newUser, 
            [name]: value
        })
    }
    const handleSubmit = async () => { 
        try{
            const response = await createUser(newUser);
            console.log("User created successfully: ", response)
            setNewUser({ email: '', password: '', full_name: '' });
            
        }catch(error){
            console.log("Error creating user: ", error)
        }
        
    }

  return (
    <div>
        <div>Add New User</div>
        <input
            type='text'
            name='full_name'
            placeholder='Enter full name'
            value = {newUser.full_name}
            onChange={handleChange}
            className='border p-2 rounded-lg'
        />
        <input
            type='email'
            name='email'
            placeholder='Enter email'
            value={newUser.email}
            onChange={handleChange}
            className='border p-2 rounded-lg'
        />
        <input
            type='password'
            name='password'
            placeholder='Enter New password'
            value={newUser.password}
            onChange={handleChange}
            className='border p-2 rounded-lg'
        />
        <button
            className='bg-blue-500 text-white p-2 rounded-lg mt-2'
            onClick={handleSubmit}
        >
            Submit
        </button>
    </div>
  )
}

export default RegisterUser