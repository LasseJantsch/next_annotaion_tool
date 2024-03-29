import {login, signup} from './actions'

export default function LoginPage() {

  return (
    <div className='login_page'>
      <form className='login_container'>
        <div className='login_input_container'>
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className='login_input_container'>
          <label htmlFor="password">Password:</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button className='login_button' formAction={login}>Log in</button>
        <button className='login_button' formAction={signup}>Sign up</button>
      </form>
    </div>
  )
}