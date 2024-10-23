import React from 'react'
import { getPublicPage } from '@/lib/data';
import { notFound } from 'next/navigation';
import PublicPage from '@/components/page/view/PublicPage';
import { headers } from 'next/headers'
import { BASE_DOMAIN } from '@/routes';

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
  
  const [subdomain, domain]= host.split('.'); 
  if (domain!==BASE_DOMAIN) {
    return notFound()
  }

  if (!subdomain) {
    return notFound()
  }

  const publicPageData = await getPublicPage({username:subdomain , projectSlug: a, slug: b})
  if (!publicPageData) {
    return notFound()
  }

  return (
  <PublicPage pageData={publicPageData}/>
  )
}

export default page