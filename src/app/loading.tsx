import { LoaderPinwheel } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='h-screen max-h-full min-h-fit w-full flex flex-col justify-center items-center'>
       <div>
        <LoaderPinwheel className='h-12 w-12 animate-spin'/>
       </div>
    </div>
  )
}

export default Loading