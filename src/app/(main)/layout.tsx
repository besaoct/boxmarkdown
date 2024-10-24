
import Dashboard from '@/components/common/Wrapper';
import { currentUser } from "@/lib/auth";
import { BASE_DOMAIN } from '@/routes';
import { headers } from 'next/headers';
import { notFound, redirect } from "next/navigation";





export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const headerList = headers()
  const host = headerList.get('host')!
  
  if (host.endsWith(`.${BASE_DOMAIN}`)) {
    return notFound()
  }

  const user = await currentUser()
  if(!user) redirect('/');
  
  
  return (
    <>

             <Dashboard user={user}>
                {children}
              </Dashboard>
    
      </>

  );
}
