import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

const Markdown = ({children}: Readonly<{
    children: string;
  }>) => {
  return (
<div className={'prose dark:prose-invert w-full max-w-full '}>
  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className={`
  w-full prose-headings:my-4`}

  components={{
    h1: ({ node, ...props }) => <h1 className='!mb-8 !mt-0' {...props} />,
  }}
    >
    {children}
  </ReactMarkdown>
</div>
  )
}

export default Markdown