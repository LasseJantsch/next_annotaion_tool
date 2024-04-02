import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation'


export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    
  return (
    <div>
        {children}
    </div>
  );
}

