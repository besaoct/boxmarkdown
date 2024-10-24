import React from 'react'
import { getPublicPage } from '@/lib/data';
import { notFound } from 'next/navigation';
import PublicPage from '@/components/page/view/PublicPage';
import { headers } from 'next/headers'
import { BASE_DOMAIN } from '@/routes';
import { getPlanLabel } from '@/lib/plan';

interface pageProps {
  params:{
      a:string
      b:string;
  },

}

const page = async({params:{a,b,}}:pageProps) => {
  
  // console.log(a,b)

  const headerList = headers()
  const host = headerList.get('host')!
  
  if (!host.endsWith(`.${BASE_DOMAIN}`)) {
    return notFound()
  }
  
  const subdomain = host.split('.')[0]; 
 
  if (!subdomain) {
    return notFound()
  }

  const publicPageData = await getPublicPage({username:subdomain , projectSlug: a, slug: b})
  if (!publicPageData) {
    return notFound()
  }

  const plan = getPlanLabel(publicPageData.user);

  if (!(plan==='Pro' || plan==='Member')) {
    return notFound()
  }

  return (
  <PublicPage pageData={publicPageData}/>
  )
}

export default page