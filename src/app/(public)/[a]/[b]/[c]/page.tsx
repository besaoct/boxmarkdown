import { notFound, permanentRedirect } from 'next/navigation';
import { headers } from 'next/headers';
import { BASE_DOMAIN, BASE_METHOD } from '@/routes';
import { getPublicPage } from '@/lib/data';
import { getPlanLabel } from '@/lib/plan';
import PublicPage from '@/components/page/view/PublicPage';

interface pageProps {
  params:{
      a:string
      b:string;
      c:string
  },
}

const page = async({params:{a, b, c}}:pageProps) => {
  
  const headerList = headers()
  const host = headerList.get('host')!

  const publicPageData = await getPublicPage({username:a, projectSlug: b, slug: c})
  if (!publicPageData) {
    return notFound()
  }
  const plan = getPlanLabel(publicPageData.user);


  if (plan==='Pro' || plan==='Member') {
    if (host.endsWith(`.${BASE_DOMAIN}`)) {
      return notFound()
    } else permanentRedirect(`${BASE_METHOD}://${a}.${BASE_DOMAIN}/${b}/${c}`)
  }

  
  return (
  <PublicPage pageData={publicPageData}/>
  )
}

export default page