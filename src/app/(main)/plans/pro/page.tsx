import ProPlan from '@/components/plans/Pro'
import { currentUser, getUserByUsername } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react'

const page =async () => {
    const user = await currentUser();
    const userData= await getUserByUsername(user.username)
    if (userData?.isPro || userData?.isMember) {
        redirect('/dashboard')
    }
  return (
   <>
   <ProPlan user={userData} />
   </>
  )
}

export default page