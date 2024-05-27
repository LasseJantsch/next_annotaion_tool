import { createClient } from '@/utils/supabase/server'
import Dashboard from './dashboard'
import { redirect } from 'next/navigation'


export default async function Account() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  !user && redirect('/login')


  return <Dashboard user={user} />
}