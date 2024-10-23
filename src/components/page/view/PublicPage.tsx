"use client";

import { PublicPageType } from "@/lib/data";
import React from "react";
import Info from "../common/info";
import Markdown from "../common/Markdown";

const PublicPage = ({ pageData }: { pageData: PublicPageType }) => {
  if (!pageData || pageData.isPublished === false) {
    return null;
  }

  const info = pageData.publicPageConfig;

  return (
    <div className="min-h-screen w-full flex flex-col gap-4 system p-6 py-8 max-w-4xl mx-auto">
      <Info info={info} />
      {/* pageData Content */}
      <Markdown>{pageData.content}</Markdown>
    </div>
  );
};

export default PublicPage;
