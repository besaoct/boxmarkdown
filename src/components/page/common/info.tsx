"use client";
import React from 'react'

import { Globe, Mail, MoonIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Comforter_Brush } from "next/font/google";
import Link from "next/link";

const font = Comforter_Brush({
  subsets: ["latin"],
  weight: "400",
});

const Info = ({info}:any) => {
    const { theme, setTheme } = useTheme();
  return (
  <>
        {info && (info.displayName || info.toggleDarkmode) && (
        <div className="flex items-center justify-between gap-4 w-full ">
          {info?.displayName && (
            <div
              className={` 
         whitespace-nowrap text-3xl font-medium
         ${font.className}
            w-fit
          `}
            >
              <p>{info.displayName}</p>
            </div>
          )}

          {info.toggleDarkmode && (
            <button
              className="relative w-10 h-6 bg-gray-200 dark:bg-neutral-800 rounded-full p-1 transition-colors duration-300 focus:outline-none"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {/* The slider ball */}
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-neutral-950 flex items-center justify-center transition-transform duration-300 border dark:border-neutral-500 p-1 transform ${
                  theme === "dark" ? "translate-x-4" : ""
                }`}
                suppressHydrationWarning
              >
                {/* Sun/Moon Icons inside the ball */}
                {theme === "dark" ? (
                  <MoonIcon className="h-4 w-4 text-neutral-300" />
                ) : (
                  <Sun className="h-4 w-4 text-orange-500" />
                )}
              </div>
            </button>
          )}
        </div>
      )}

      {(info?.contactLink || info?.contactMail) && (
        <div className="flex gap-4  flex-nowrap items-center justify-start pb-4 overflow-x-auto w-full">
          {info?.contactLink && (
            <Link
              href={`${info.contactLink}`}
              className="flex   items-center gap-2 text-sm font-medium text-muted-foreground"
            >
              <Globe className="text-cyan-300/70 size-5" /> Connect
            </Link>
          )}
          {info?.contactMail && (
            <Link
              href={`mailto:${info.contactMail}`}
              className="flex  items-center gap-2 text-sm  font-medium  text-muted-foreground"
            >
              <Mail className="text-indigo-300/70 size-5" /> {info.contactMail}
            </Link>
          )}
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