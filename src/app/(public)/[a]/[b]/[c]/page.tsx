import { notFound, permanentRedirect } from 'next/navigation';
import { headers } from 'next/headers';
import { BASE_DOMAIN, BASE_METHOD } from '@/routes';

interface pageProps {
  params:{
      a:string
      b:string;
      c:string
  },
}

const page = async({params:{a, b, c}}:pageProps) => {
  
  // console.log(a,b,c);

  const headerList = headers()
  const host = headerList.get('host')!

  if (host.endsWith(`.${BASE_DOMAIN}`)) {
    return notFound()
  } else permanentRedirect(`${BASE_METHOD}://${a}.${BASE_DOMAIN}/${b}/${c}`)
  
  
  // const publicPageData = await getPublicPage({username:a, projectSlug: b, slug: c})
  // if (!publicPageData) {
  //   return notFound()
  // }
  // return (
  // <PublicPage pageData={publicPageData}/>
  // )
}

export default page