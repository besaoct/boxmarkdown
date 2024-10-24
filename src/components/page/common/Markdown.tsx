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
    h1: ({ node, ...props }) => <h1 className='!mt-0 !mb-8 text-2xl md:!text-3xl lg:!text-4xl' {...props} />,
    h2: ({ node, ...props }) => <h1 className='!text-xl md:!text-2xl  lg:!text-3xl  !font-bold' {...props} />,
    h3: ({ node, ...props }) => <h1 className='!text-lg md:!text-xl   lg:!text-2xl  !font-semibold' {...props} />,
    h4: ({ node, ...props }) => <h1 className='!text-base md:!text-lg lg:!text-xl   !font-medium' {...props} />,
    h5: ({ node, ...props }) => <h1 className='!text-sm md:!text-base lg:!text-lg   !font-normal' {...props} />,
    ul: ({ node, ...props }) => <ul className='!ps-4' {...props} />,
    li: ({ node, ...props }) => <li className='!ps-0.5 marker:!text-muted-foreground' {...props} />,
  }}
    >
    {children}
  </ReactMarkdown>
</div>
  )
}

export default Markdown