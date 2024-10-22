import PageCreator from '@/components/page/create/PageCreator'
import React from 'react'
import { getAllProjects } from '@/lib/data';

const page = async() => {

  const projects =  await getAllProjects();

  return (
    <div className=''>
        <PageCreator projects={projects} />
    </div>
  )
}

export default page