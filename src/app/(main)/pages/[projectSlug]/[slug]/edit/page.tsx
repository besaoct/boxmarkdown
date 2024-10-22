import PageUpdate from '@/components/page/edit/pageUpdate';
import { getAllProjects, getPageBySlugs } from '@/lib/data';
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
    const projects =  await getAllProjects();

    if (!pageData) {
      return notFound()
    }
  return (
     <PageUpdate projects={projects} pageData={pageData}/>
  )
}

export default page