import { BASE_DOMAIN } from "@/routes";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface pageProps {
    children: Readonly<React.ReactNode>;
 }
 

export default async function RootLayout({children}: pageProps) {
  const headerList = headers()
  const host = headerList.get('host')!
  
  if (host.endsWith(`.${BASE_DOMAIN}`)) {
    return notFound()
  }

  return (
     <>
       {children}
      </>

  );
}
