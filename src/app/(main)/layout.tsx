
import { ThemeProvider } from "next-themes"
import Dashboard from '@/components/common/Wrapper';
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProgressBarProvider from "@/components/ProgressbarProvider";





export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await currentUser()
  if(!user) redirect('/');
  
  
  return (
    <>
   
             <ProgressBarProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
             <Dashboard user={user}>
                {children}
              </Dashboard>
            </ThemeProvider>
             </ProgressBarProvider>
    
      </>

  );
}
