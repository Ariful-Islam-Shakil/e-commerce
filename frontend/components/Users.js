'use client'
import { useRepo } from '@/context/RepoContext'
import { listUsers } from '@/lib/user_routes';
import React, { useEffect } from 'react'

const Users = () => {
    const {users, setUsers} = useRepo();
    useEffect(()=>{
        const fetchUsers = async ()=>{
            try{
                const response = await listUsers();
                setUsers(response)
            }catch(error){
                console.log(error)

            }
        };
        fetchUsers();
    },[]);

    return (
        <div className='border-2 bg-green-500 text-black'>
            {users.map((user, idx)=>(
                <li key={idx}>name: {user.full_name} | email: {user.email} </li>
            ))}

        </div>
    )
}

export default Users