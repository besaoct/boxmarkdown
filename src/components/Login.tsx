'use client'

import React from 'react'
import { Button } from './ui/button'
import { signIn } from 'next-auth/react'
import { CgGoogle } from 'react-icons/cg'
import Image from 'next/image'
import Link from 'next/link'

const Login = () => {
  return (
    <div className="min-h-screen h-full flex items-center justify-center dark bg-background text-foreground p-4">
      <div className="bg-neutral-900 p-8 border shadow-sm max-w-md w-full text-center flex flex-col items-center gap-4">
        {/* Logo */}
        <Image width={100} height={100} src='/logo.png' alt='logo' className="mb-4" />

        {/* Welcome Text */}
        <h1 className="text-2xl font-semibold sr-only ">BOXmarkdown</h1>
        <p className='text-sm sm:text-base'>BOXmarkdown, a Horofy product. </p>
        <p className=" text-muted-foreground text-sm sm:text-base">
        Please sign in with Google to continue. By signing in, you agree to our <a href="https://horofy.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">terms and conditions</a>.
        </p>

        {/* Google Sign-In Button */}
        <Button 
          onClick={() => signIn('google')} 
          className="w-full  font-medium py-2 px-4 flex items-center justify-center gap-2"
        >
          <CgGoogle size={24} /> Sign in with Google
        </Button>

      <Link href={'/'} className='p-2 hover:underline'>
        Go back to home
      </Link>
      </div>
    </div>
  )
}

export default Login
