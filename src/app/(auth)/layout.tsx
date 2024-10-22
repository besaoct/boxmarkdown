
interface pageProps {
    children: Readonly<React.ReactNode>;
 }
 

export default async function RootLayout({children}: pageProps) {


  return (
     <>
       {children}
      </>

  );
}
