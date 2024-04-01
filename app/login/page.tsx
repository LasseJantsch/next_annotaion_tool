import {login} from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  user && redirect('/')

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
      </form>
    </div>
  )
}