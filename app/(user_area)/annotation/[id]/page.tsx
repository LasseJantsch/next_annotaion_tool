import { createClient } from '@/utils/supabase/server'
import AnnotationTool from './annotationTool'

export default async function Account({params}:any) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <AnnotationTool user={user} params={params}/>
}