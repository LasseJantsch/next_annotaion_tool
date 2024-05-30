import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ReviewDashboard from './reviewDashboard'


export default async function Account() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  !user && redirect('/login')


  return <ReviewDashboard user={user} />
}