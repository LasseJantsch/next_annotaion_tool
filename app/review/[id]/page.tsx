import { createClient } from '@/utils/supabase/server'
import AnnotationTool from './reviewPlatform'
import { redirect } from 'next/navigation'


export default async function Account({params}:any) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  !user && redirect('/login')

  return <AnnotationTool user={user} params={params}/>
}