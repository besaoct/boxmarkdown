import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
<div className="flex gap-2 flex-col items-center justify-center h-screen w-full text-center mx-auto p-4">
<h2 className="text-xl font-bold text-red-600">Oops! <p className='inline text-foreground text-lg font-normal'>looks like we missed the mark! 🔥</p></h2>
  <p className="text-lg">Not quite what you were craving? No worries!</p>
  <Link href={''} className='underline text-indigo-500 font-semibold hover:text-indigo-700'>Give it another shot!</Link>
  <span className="mx-1">or</span>
  <Link href={'/'} className='underline text-indigo-500 font-semibold hover:text-indigo-700'>Get back to your happy place! 🏡</Link>
</div>

  )
}

export default page