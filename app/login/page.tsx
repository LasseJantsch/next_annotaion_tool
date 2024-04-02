'use client'
import {login} from './actions'
import { useState } from 'react'
import ErrorBanner from '../(user_area)/errorBanner'

export default function LoginPage() {
  const [error, setError] = useState<string>('')

  const handleFormSubmit = (event:FormData) => {
    login(event)
  }

  return (
    <div className='login_page'>
      {error && <ErrorBanner message={error} setError={setError}/>}
      <form className='login_container'>
        <div className='login_input_container'>
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className='login_input_container'>
          <label htmlFor="password">Password:</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button className='login_button' formAction={handleFormSubmit}>Log in</button>
      </form>
    </div>
  )
}