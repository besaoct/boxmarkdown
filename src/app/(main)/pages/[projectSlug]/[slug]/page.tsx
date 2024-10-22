import ManagePage from '@/components/page/manage/ManagePage';
import { getPageBySlugs } from '@/lib/data'
import { notFound } from 'next/navigation';
import React from 'react'

interface pageProps {
    params:{
        projectSlug:string;
        slug:string
    }
}

const page = async({params:{slug, projectSlug}}:pageProps) => {

  const pageData = await getPageBySlugs(slug, projectSlug)
  
  if (!pageData) {
    return notFound()
  }


  return (
   <>
    <ManagePage pageData={pageData}/>
   </>
  )
}

export default page