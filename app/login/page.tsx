'use client'
import {login} from './actions'
import { useState } from 'react'
import ErrorBanner from '../(components)/errorBanner'
import BasicBox from '../(components)/basicBox'
import LoginIcon from '@mui/icons-material/Login';

export default function LoginPage() {
  const [error, setError] = useState<string>('')

  const handleFormSubmit = (event:FormData) => {
    login(event)
  }

  return (
    <div className='login_page'>
      {error && <ErrorBanner message={error} setError={setError}/>}
      <BasicBox title='LOGIN' classNames='login_container'>
        <form>
          <div className='login_input_container'>
            <label htmlFor="email">username:</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className='login_input_container'>
            <label htmlFor="password">password:</label>
            <input id="password" name="password" type="password" required />
          </div>
          <button className={`login_button`}  formAction={handleFormSubmit}>
            <div className="icon_button_title">LOGIN </div>
            <div className="icon_button_icon">
              <LoginIcon/>
            </div>
        </button>
        </form>
      </BasicBox>
    </div>
  )
}