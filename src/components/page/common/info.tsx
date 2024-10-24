"use client";
import React from 'react'

import { Dot, Globe, Mail, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Comforter_Brush } from "next/font/google";
import Link from "next/link";
import { MoonIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

const font = Comforter_Brush({
  subsets: ["latin"],
  weight: "400",
});

const Info = ({info}:any) => {
    const { theme, setTheme } = useTheme();
    const  isDisplayNameToggleMode = (info && (info.displayName || info.toggleDarkmode))
    const  isOnlyToggleMode = (info && ((info.toggleDarkmode) && !info.displayName ))
    const  isOnlyDisplayName = (info && ((info.toggleDarkmode) && info.displayName ))
    const showAuthor = info && info.showAuthor && info?.user
  return (
  <>
        {info && (info.displayName || info.toggleDarkmode) && (
        <div className={`flex items-start ${info.displayName? 'justify-between' : 'justify-end'}  gap-4 w-full pb-4`}>
          {info?.displayName && (
            <div
              className={` 
         whitespace-nowrap text-4xl font-medium
         ${font.className}
            w-fit
          `}
            >
              <p>{info.displayName}</p>
            </div>
          )}

          {info.toggleDarkmode && (
            <button
            className="relative w-6 h-6 rounded-full transition-colors duration-300 focus:outline-none"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {/* The slider ball */}
            <div
              className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-black flex items-center justify-center transition-colors duration-300 p-2 border dark:border-neutral-500  "
              suppressHydrationWarning
            >
              {/* Sun/Moon Icons with rotation */}
              <div
                className={`transform transition-transform duration-300 ${
                  theme === "dark" ? "rotate-90" : "rotate-0"
                }`}
              >
                {theme === "dark" ? (
                  <MoonIcon className="h-4 w-4 text-neutral-300" />
                ) : (
                  <Sun className="h-4 w-4 text-neutral-800" />
                )}
              </div>
            </div>
          </button>
          
          )}
        </div>
      )}

      {(info?.contactLink || info?.contactMail || showAuthor) && (
      <div className={`flex flex-col items-start justify-start w-full gap-4 
         ${ isOnlyToggleMode ? '-mt-14'  : isDisplayNameToggleMode ? '-mt-4': ''}`}>
       {showAuthor && 
                <div className={`flex items-center justify-center gap-2  ${isOnlyDisplayName && 'mt-4'}`}>
                <Image src={info.user?.image} className='w-11 border' priority height={100} width={100} alt={info.user?.username} />
                 <div className='flex flex-col  font-medium '>
                 <p className='text-muted-foreground'> {info.user?.name}</p>
                   <p className='text-sm font-normal text-muted-foreground'> 
                    {info?.readingTime} min read <Dot className='inline'/>
                    {`${info?.postedAt?.toDateString().split(' ').slice(0,3).join(' ')}, ${info?.postedAt?.toDateString().split(' ')[3]}`}</p>
                 </div>
             </div>
    }
        <div className="flex gap-4  flex-nowrap items-center justify-start overflow-x-auto w-full pb-4">
         
          {info?.contactLink && (
            <Link
              href={`${info.contactLink}`}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Globe className="text-cyan-300/70 size-5" /> Connect
            </Link>
          )}
          {info?.contactMail && (
            <Link
              href={`mailto:${info.contactMail}`}
              className="flex  items-center gap-2 text-sm  text-muted-foreground"
            >
              <Mail className="text-indigo-300/70 size-5" /> {info.contactMail}
            </Link>
          )}
        </div>
      </div>
      )}

      {/* Project Name */}
      {info?.projectName && (
        <div className={" w-fit text-xl font-thin"}>
          <p>
            <span className="text-rose-300 text-3xl"># </span>
            {info.projectName}
          </p>
        </div>
      )}

  
  </>
  )
}

export default Info