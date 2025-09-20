import { useRepo } from '@/context/RepoContext';
import { login } from '@/lib/auth_routes';
import React, { useState } from 'react'

const Login = () => {
    const [credentials, setCredentials] = React.useState({email: '', password: ''});
    const {accessToken, setAccessToken} = useRepo();
    const [loginMessage, setLogingMessage] = useState('');
    const handleChange = (e)=>{
        const {name, value} = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        })
    }
    const handleLogin = async ()=>{
        try{
            const response = await login(credentials);
            console.log("Login succsessful: ", response);
            setCredentials({email: '', password: ''});
            setAccessToken(response.access_token);
        }catch(error){
            console.log("Error logging inL :", error)
        }
    }

  return (
    <div>Login
        <div>
            <input
                type='email'
                name='email'
                placeholder='Enter email'
                value={credentials.email}
                className='border p-2 rounded-lg'
                onChange={handleChange}
            />
                <input
                type='password'
                name='password'
                placeholder='Enter password'
                value={credentials.password}
                className='border p-2 rounded-lg'
                onChange={handleChange}
            />
            <button
                className='bg-blue-500 text-white p-2 rounded-lg mt-2'
                onClick={handleLogin}
            >
                Login
            </button>
            {loginMessage && <p>{loginMessage}</p>}
        </div>
    </div>
  )
}

export default Login