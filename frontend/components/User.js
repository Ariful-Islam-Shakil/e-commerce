import { getUserById } from '@/lib/user_routes';
import React, { useEffect, useState } from 'react'

const User = () => {
    const [userInfo, setUserInfo] = useState(null)



    useEffect(() => {
        const fetchUser = async (userId)=>{
            try{
                const user = await getUserById(userId);
                console.log(user);
                setUserInfo(user)
            }
            catch(error){
                console.log(error);
            }
        }
        fetchUser(1);
    },[]);
  return (
    <div>
        {userInfo ? (
            <div>
                <h2>User : {userInfo.full_name} </h2>
            </div>
        ):(<p>Loading...</p>)}
    </div>
  )
}

export default User