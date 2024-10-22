'use client'

import { deleteMyPage, publishPage } from '@/actions/user/manage-page';
import { toast } from '@/hooks/use-toast';
import { PageWithProjectType } from '@/lib/data';
import { BASE_URL } from '@/routes';
import { ExternalLink,  Loader2} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import SettingsDialog from './setting';
import { ShareButton } from 'next-react-share';
import Info from '../common/info';



const ManagePage = ({ pageData }: { pageData: PageWithProjectType }) => {


  const [isPublished, setIsPublished] = useState(pageData?.isPublished);
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [error, setError] = useState<string | null>("");
  const [success, setSuccess] = useState<string | null>("");
  const [isPendingPage, startPageTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const onPublishPage = (values: {slug: string, projectSlug:string}) => {
    setError("");
    setSuccess("");
    startPageTransition(() => {
        publishPage(values)
            .then((data) => {
                if (data.error) {
                    setError(data.error && "Something went wrong!");
                }

                if (data.success) {
                    setIsPublished(data.publishedPage.isPublished)
                    setSuccess(data.success || 'Page saved.');
                    router.refresh()
                }
            })
            .catch(() => setError("Something went wrong!"))
            .finally(()=> {
              router.refresh()
            })
    });
};




// Handle delete
const handleDeletePage = (id:string) => {
  setError("");
  setSuccess("");
  startDeleteTransition(() => {
      deleteMyPage(id)
          .then((data) => {
              if (data.error) {
                  setError(data.error && 'Something went wrong');
              }

              if (data.success) {
                  setSuccess(data.success || 'Project deleted successfully');
                  toast({
                      title: "Success",
                      description: success || "Deleted successfully",
                    });
                    router.push('/pages')
              }
          })
          .catch(() => {
              setError("Something went wrong!");
              toast({
                  title: "Error",
                  description: error || "Something went wrong!",
                })
          }
      )
          .finally(()=> {
            router.refresh()
          })
  });
}

  if (!pageData) {
    return null
  }

  const info = pageData.publicPageConfig

  return (
    <div className="min-h-screen w-full flex flex-col gap-4">
           {/* Actions Section */}
           <div className="flex justify-start gap-4 items-center w-full overflow-x-auto">
          <button
            disabled={isPendingPage}
            onClick={()=>onPublishPage({ slug: pageData.slug, projectSlug: pageData.project.slug })}
            className={`px-4 py-2  text-white font-semibold ${isPublished ? 'bg-orange-600 hover:bg-orange-700' : 'bg-cyan-600 text-cyan-50 hover:bg-cyan-700'
              } transition-colors`}
          >
            { isPendingPage? <> <Loader2 className='h-4 w-4 animate-spin'/></>: isPublished ? 'Unpublish' : 'Publish'}
          </button>

          <button onClick={()=>router.push(`/pages/${pageData.project.slug}/${pageData.slug}/edit`)} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-teal-50 font-semibold  transition-colors">
            Edit
          </button>
       
           {/* Settings Button */}
      <button
        className="px-4 py-2 bg-violet-500 text-white hover:bg-violet-600 transition"
        onClick={() => setIsSettingsOpen(true)}
      >
        Header
      </button>

      <ShareButton
      title={pageData.name}
      content={pageData.content}
      url={`${BASE_URL}/${pageData.user.username}/${pageData.project.slug}/${pageData.slug}`}
      length={150}
      ellipsis={true}
      showCopied={<span style={{ color: 'green' }}>Text Copied!</span>}
      showDefault={<span className='text-white p-2 bg-cyan-600'>Share Now</span>}
    />
      {/* Render the SettingsDialog only when isSettingsOpen is true */}
      {isSettingsOpen && (
        <SettingsDialog 
          page={pageData}
          onClose={() => setIsSettingsOpen(false)} // Close dialog callback
        />
      )}

<button disabled={isDeletePending} onClick={()=>handleDeletePage(pageData.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold  transition-colors">
            {isDeletePending? <> <Loader2 className='h-4 w-4 animate-spin'/></>: 'Delete'}
          </button>
        </div>
      {/* pageData Header */}
      <div className="border-b pb-4 flex gap-4 items-start justify-between flex-col w-full overflow-x-auto ">

        <div className='flex flex-nowrap whitespace-nowrap gap-4 items-center justify-start  w-full overflow-x-auto'>

          <p className={`text-sm px-2 p-1 ${pageData.isPublished ? ' bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'} 
        shadow-sm `}>
            <span className='inline font-bold'>Status:{' '}</span> {pageData.isPublished ? 'Published' : 'Draft'}
          </p>
          <p className="text-sm px-2 p-1 bg-cyan-100 text-cyan-800 shadow-sm ">
            <span className='inline font-bold'> Page:{' '}</span> {pageData.name}
          </p>
          <p className="text-sm px-2 p-1 bg-indigo-100 text-indigo-800 shadow-sm ">
            <span className='inline font-bold'> Slug:{' '}</span>
            {pageData.slug}</p>
          <p className="text-sm px-2 p-1 bg-teal-100 text-teal-800 shadow-sm ">
            <span className='inline font-bold'> Project: {' '}</span>
            {pageData.project.name}</p>
          <p className="text-sm px-2 p-1 bg-violet-100 text-violet-800 shadow-sm ">
            <span className='inline font-bold'> Created at:{' '}</span>
            {pageData.createdAt ? new Date(pageData.createdAt).toLocaleDateString() : 'N/A'}
          </p>
          {pageData.isPublished && (
          <div className=' whitespace-nowrap'>
            <div className="border px-2 p-1  bg-slate-200 text-slate-700 w-fit overflow-x-auto whitespace-nowrap flex items-center">
              <Link href={`/${pageData.user.username}/${pageData.project.slug}/${pageData.slug}`} target='_blank' className="mr-2 text-slate-600 hover:text-slate-800">
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link target='_blank' href={`/${pageData.user.username}/${pageData.project.slug}/${pageData.slug}`} className="inline font-mono text-sm hover:underline">
                {`${BASE_URL}/${pageData.user.username}/${pageData.project.slug}/${pageData.slug}`}
              </Link>
            </div>
          </div>)
        }
        </div>
   

      </div>


      <Info info={info}/>

      {/* pageData Content */}
      <div className={'prose dark:prose-invert w-full max-w-full'}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className={'w-full'}>
          {pageData.content}
        </ReactMarkdown>
      </div>

    </div>
  );
};

export default ManagePage;
