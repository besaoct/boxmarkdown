"use client";

import { PublicPageType } from "@/lib/data";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import Info from "../common/info";



const PublicPage = ({ pageData }: { pageData: PublicPageType }) => {

  if (!pageData || pageData.isPublished === false) {
    return null;
  }

  const info = pageData.publicPageConfig;

  return (
    <div className="min-h-screen w-full flex flex-col gap-4 system p-8 max-w-5xl mx-auto">


       <Info info={info}/>

      {/* pageData Content */}
      <div className={"prose dark:prose-invert w-full max-w-full"}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          className={"w-full"}
        >
          {pageData.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default PublicPage;
