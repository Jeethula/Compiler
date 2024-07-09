import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault(); 

    if(password !== confirmPassword){
        alert('Passwords do not match');
        return;
        }
    if (username.trim() === '' || password.trim() === '' || email.trim() === '' || confirmPassword.trim() === ''){
      alert('Complete all the fields.');
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }
    try{
        const response = await axios.post('/userCreate',{
             username,
             email,
             password
        })
        console.log(response.data);
        if(response.data.message ==="success"){
          setIsLoading(false);
            setUsername('');
            setPassword('');
            setEmail('');
            setConfirmPassword('');
            navigate('/');
        }
    }catch(e){
        alert('Error in signing up');
        setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col h-screen justify-center items-center bg-indigo-200 '>
      <h1 className='font-bold text-4xl'>Sign up</h1>
    <form onSubmit={handleSubmit} className='w-full h-[60vh] mt-4 flex flex-col justify-evenly max-w-sm text-xl bg-blue-100 shadow-md rounded px-8 pt-6 pb-8 mb-4'>
      <label htmlFor="username" className='block text-gray-700  font-bold mb-2'>Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
      />
        <label htmlFor="email" className='block text-gray-700  font-bold mb-2'>Email:</label>
        <input
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />

      <label htmlFor="password" className='block text-gray-700  font-bold mb-2'>Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
      />

        <label htmlFor="confirmPassword" className='block text-gray-700  font-bold mb-2'>Confirm Password:</label>
        <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />

     {isLoading ? <div className='bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4'> Signing up...</div>
      :<button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4'>
        Sign up
      </button>}
    </form>
  </div>
  );
}

