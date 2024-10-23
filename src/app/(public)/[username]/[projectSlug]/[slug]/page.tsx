import React from 'react'
import { getPublicPage } from '@/lib/data';
import { notFound } from 'next/navigation';
import PublicPage from '@/components/page/view/PublicPage';


interface pageProps {
  params:{
      username:string
      projectSlug:string;
      slug:string
  }
}

const page = async({params:{username, projectSlug, slug}}:pageProps) => {
  const publicPageData = await getPublicPage({username:username, projectSlug: projectSlug, slug: slug})
  if (!publicPageData) {
    return notFound()
  }
  return (
  <PublicPage pageData={publicPageData}/>
  )
}

export default page