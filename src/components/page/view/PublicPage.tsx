"use client";

import { PublicPageType } from "@/lib/data";
import React from "react";
import Info from "../common/info";
import Markdown from "../common/Markdown";
import { calculateReadingTime } from "@/lib/utils";

const PublicPage = ({ pageData }: { pageData: PublicPageType }) => {
  if (!pageData || pageData.isPublished === false) {
    return null;
  }

  const readingTime = calculateReadingTime(pageData.content)
  

  const info ={ 
    ...pageData.publicPageConfig,
    user:pageData.user, 
    postedAt:pageData.createdAt,
    readingTime:readingTime,
  };


  return (
    <div className="min-h-screen overflow-hidden flex flex-col gap-4 system p-4 py-6 max-w-4xl mx-auto w-full">
     <Info info={info} />
      {/* pageData Content */}
      <Markdown>{pageData.content}</Markdown>
    </div>
  );
};

export default PublicPage;
