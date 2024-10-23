
import Dashboard from '@/components/common/Wrapper';
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";





export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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
