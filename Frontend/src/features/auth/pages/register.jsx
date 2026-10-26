import React, {useState} from 'react'
import {useNavigate, Link} from 'react-router';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {

  const{loading, handleRegister} = useAuth()
  const [username, setUsername ] = useState("")
  const[ email, setEmail] = useState("")
  const[ password, setPassword ] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    try {
      await handleRegister({userName: username, email, password})
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    }
  }

  if(loading) {
    return <main><h1> Loading..... </h1></main>
  }
  
  return (
     <main>
      <div className='form-container'>
        <h1>Register</h1>
        {error && <p role="alert">{error}</p>}
        <form onSubmit={handleSubmit}>
              
          
             <div className='input-form'>
            <label htmlFor='username'> Username </label>
            <input 
            onChange={(e)=>{setUsername (e.target.value)}}
            type='text' id='username' name='username' placeholder='Enter your Name'></input>
            
          </div>
          <div className='input-form'>
            <label htmlFor='email'> email </label>
            <input 
            onChange={(e)=>{setEmail(e.target.value)}}
            type='email' id='email' name='email' placeholder='Enter your email'></input>
            </div>
        
              <div className='input-form'>
            <label htmlFor='password'> Password </label>
            <input 
            onChange={(e)=>{setPassword(e.target.value)}}
            type='password' id='password' name='password' placeholder='Enter your Password'></input>

            
          </div>
          <button className='button primary-button'>Register</button>
        </form>
        <p>Already have an Account? <Link to={'/login'}>Login</Link></p>
      </div>
    </main>
  )
}

export default RegisterPage