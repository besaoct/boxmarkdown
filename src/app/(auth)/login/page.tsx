import Login from '@/components/Login'
import { currentUser } from '@/lib/auth'
import { BASE_URL } from '@/routes'
import { redirect } from 'next/navigation'
import React from 'react'


interface pageProps {
   searchParams :{
      redirectUrl:string
   }
}


const page = async({searchParams: {redirectUrl}}:pageProps) => {

  const user = await currentUser()
  if(user) redirect( redirectUrl ? `${BASE_URL}/${decodeURIComponent(redirectUrl)}` : `/`);

  return (
 <>
 <Login/>
 </>    
  )
}

export default page