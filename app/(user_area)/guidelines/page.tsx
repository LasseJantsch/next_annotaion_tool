import { createClient } from '@/utils/supabase/server'
import Guidlines from './guidelines'
import { redirect } from 'next/navigation'




export default async function Account() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  !user && redirect('/login')

  return( 
    <div className='guidelines_page'>
        <Guidlines/>
    </div>
  )
}