import React,{useState} from 'react'
import "../auth.form.scss"
import {useNavigate, Link} from 'react-router';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const{loading , handleLogin} = useAuth();

  const [email, setEmail ] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate();
        const handleSubmit = async (e) => {
          e.preventDefault()
          await handleLogin({email, password})
          navigate('/dashboard')

        }

        if(loading) {
          return (<main><h1>Loading......</h1></main>)
        }
        
  return (
    <main>
      <div className='form-container'>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className='input-form'>
            <label htmlFor='email'> email </label>
            <input 
            onChange={(e)=> {setEmail (e.target.value) }}
            type='email' id='email' name='email' placeholder='Enter your email'></input>
            
          </div>
              <div className='input-form'>
            <label htmlFor='password'> Password </label>
            <input
            onChange={(e)=>{setPassword (e.target.value)}}
             type='password' id='password' name='password' placeholder='Enter your Password'></input>

            
          </div>
          <button className='button primary-button'>Login</button>
        </form>
        <p>Do not have an Account? <Link to={'/register'}>Register</Link></p>
      </div>
    </main>
  )
}

export default LoginPage