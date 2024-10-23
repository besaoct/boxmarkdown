
import BasicPlan from '@/components/plans/Basic'
import { currentUser, getUserByUsername } from '@/lib/auth'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async() => {

  const user = await currentUser();
  const userData= await getUserByUsername(user.username);
  
  if (userData?.isBasic || userData?.isPro || userData?.isMember) {
    redirect('/')
  }

  return (
    <>
       <BasicPlan user={userData}/>
    </>
  )
}

export default page