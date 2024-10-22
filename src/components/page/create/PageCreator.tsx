"use client";

import React, { useState, useTransition } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown
import rehypeRaw from 'rehype-raw'; 
import MarkdownEditor from '../../editors/simple/Editor';
import { PageCreatorSchema, ProjectCreatorSchema } from '@/schemas';
import { z } from 'zod';
import { createPage } from '@/actions/user/manage-page';
import { createProject } from '@/actions/user/manage-project';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces for better type safety

interface PageData {
  projectName:string;
  projectSlug: string;
  pageName: string;
  pageSlug: string;
  pageDesc: string;
  generatedContent: string;
}

export default function PageCreator({projects}:{ projects:any}) {
  
  const router = useRouter()

  // State Management

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectName, setProjectName] = useState( pageData?.projectSlug || '');
  const [projectSlug, setProjectSlug] = useState( pageData?.projectName|| '');
  const [pageName, setPageName] = useState(pageData?.pageName || '');
  const [pageSlug, setPageSlug] = useState( pageData?.pageSlug || '');
  const [pageContent, setPageContent] = useState( pageData?.generatedContent || '');
  const [pageDesc, setPageDesc] = useState( pageData?.pageDesc || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState<boolean>(false);

  // Helper function to generate slugs
  const generateSlug = (text: string): string => {
    return encodeURIComponent(
      text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')  // Remove invalid characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/--+/g, '-')      // Replace multiple dashes with a single one
    );
  };

  // Handlers for input changes
  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setProjectName(name);
    setProjectSlug(generateSlug(name));
  };

  const handlePageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setPageName(name);
    setPageSlug(generateSlug(name));
  };



  // Handler to create a new page and generate content via API
  const handleCreatePage = async () => {
    if (!selectedProject?.slug || pageName.trim() === '' || pageSlug.trim() === '' || pageDesc.trim() === '') {
      setError('All fields are required to create a page.');
      return;
    }

    setLoading(true);
    setError(null);

    // Construct the prompt based on page details
    const prompt = `Create a detailed webpage with the following details:
    - **Project name:** ${selectedProject.name}
    - **Project Slug:** ${selectedProject.slug}
    - **Page Name:** ${pageName}
    - **Page Slug:** ${pageSlug}
    - **Page Description:** ${pageDesc}`;

    const payload = {
      prompt: prompt
    };

    try {
      const response = await fetch('/api/creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jsonData: payload }),
      });

      const result = await response.json();
    

      if (response.ok) {
          const generatedContent: string = result.markdownPage;
          const newPageData: PageData = {
            projectName: selectedProject.name,
            projectSlug: selectedProject.slug,
            pageName,
            pageSlug,
            pageDesc,
            generatedContent,
          };
        
          setPageData(newPageData);
          setPageContent(generatedContent);
          setActiveTab('preview');
        
      } else {
        setError('Failed to generate content. Please try again!');
      }
    } catch (err) {
      console.error('Error generating content:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const genBtnVisible = 
  !(!(selectedProject?.name || pageData?.projectName) || 
  !(selectedProject?.slug || pageData?.projectSlug) || 
  !(pageName || pageData?.pageName) || 
  !(pageSlug || pageData?.pageSlug )|| 
  !(pageDesc || pageData?.pageDesc));


  const [error, setError] = useState<string | null>("");
  const [success, setSuccess] = useState<string | null>("");

  const [isPendingPage, startPageTransition] = useTransition();
  const onSubmitPage = (values: z.infer<typeof PageCreatorSchema>) => {
    setError("");
    setSuccess("");
    startPageTransition(() => {
        createPage(values)
            .then((data) => {
                if (data.error) {
                    setError("Please Upgrade your plan or Try again!");
                    router.push(`/plans`)
                }

                if (data.success) {
                    setSuccess(data.success || 'Page saved.');
                    router.push(`/pages/${values.projectSlug}/${data.newPage.slug}`)
                }
            })
            .catch(() => setError("Something went wrong!"))
            .finally(()=> {
              router.refresh()
            })
    });
};


const [isPendingProject, startProjectTransition] = useTransition();
const onSubmitProject = (values: z.infer<typeof ProjectCreatorSchema>) => {
  setError("");
  setSuccess("");
  startProjectTransition(() => {
      createProject(values)
          .then((data) => {
              if (data.error) {
                  setError(data.error && "Something went wrong!");
              }

              if (data.success) {
                  setSuccess(data.success || 'Project saved.');
              }
          })
          .catch(() => setError("Something went wrong!"))
          .finally(()=> {
            router.refresh()
          })
  });
};


 // Handler to save project
 const handleSaveProject = () => {
  if (projectName.trim() === '' || projectSlug.trim() === '') {
    setError('Project name and slug cannot be empty.');
    return;
  }

  // Check for duplicate slugs
  if (projects?.find((project:any) => project.slug === projectSlug)) {
    setError('Project slug must be unique.');
    return;
  }

  onSubmitProject({
      name:projectName,
      slug: generateSlug(projectSlug),
  });

  setIsDialogOpen(false);
  setProjectName('');
  setProjectSlug('');
  setError(null);
};

// Handler to save page
const handleSavePage = () => {
  if (pageData) {
    onSubmitPage({
      projectSlug: pageData.projectSlug,
      name: pageName,
      slug: generateSlug(pageSlug),
      content: pageContent,
      isPublished: false, 
    });
  } else {
    setError("Page data is missing.");
  }
};


  return (
    <div className="w-full mx-auto flex flex-col gap-4">
      {/* Project Selection and Creation */}
      <div className="w-full flex gap-4 overflow-x-scroll flex-nowrap items-start">
        {/* Button to Create New Project */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className='w-fit'>
              Create new project
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-[20rem] sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Enter project details to create a new project.
            </DialogDescription>
      
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newProjectName" className={'sr-only'}>Project Name</Label>
                <Input
                  id="newProjectName"
                  // defaultValue={pageData?.projectName || projectName}
                  value={projectName}
                  onChange={handleProjectNameChange}
                  className={'border-0 border-b focus:dark:border-neutral-100 focus:border-neutral-600 p-0'}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newProjectSlug" className={'sr-only'}>Project Slug</Label>
                <Input
                  id="newProjectSlug"
                  // defaultValue={pageData?.projectSlug || projectSlug}
                  value={projectSlug}
                  onChange={(e) => setProjectSlug(e.target.value)}
                  className={'border-0 border-b focus:dark:border-neutral-100 focus:border-neutral-600 p-0'}
                  placeholder="Enter project slug"
                />
              </div>
              {success&& <p className="text-green-500 text-sm">{success}</p>}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button onClick={handleSaveProject} disabled={isPendingProject}>
                {isPendingProject? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Project Selection Dropdown */}
        <Select value={selectedProject?.slug || ''} 
          onValueChange={
          (slug)=>{
            const project = projects?.find((proj:any) => proj.slug === slug) || null;
            setSelectedProject(project);
        }}>
          <SelectTrigger className='min-w-[12rem] w-64'>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          {((projects && (projects.length > 0)) || pageData?.projectSlug )? (
            <SelectContent className=''>
              {projects?.map((project:any) => (
                <SelectItem key={project.slug} 
                defaultValue={pageData?.projectSlug} 
                value={project.slug}
                className=''
                >
                 <div className='max-w-[12rem] w-full flex items-center justify-start gap-1'>
                 <p className='whitespace-nowrap'>{project.name}</p>
                  <p className='text-xs text-muted-foreground line-clamp-1  break-all '> (
                    {project.slug})
                  </p>
                 </div>
                </SelectItem>
              ))}
            </SelectContent>
          ) : (
            <SelectContent>
              <p className='px-2 py-1 text-sm text-muted-foreground'>No projects found</p>
            </SelectContent>
          )}
        </Select>
      </div>

      {/* Page Creation Form */}
      <div className='space-y-4'>
        <div className='flex flex-col gap-4'>
         <div className='flex flex-row gap-4 items-center justify-between flex-wrap'>
         <div className="flex-1">
            <Label htmlFor="pageName" className={'sr-only'}>Page Name</Label>
            <Input
              id="pageName"
              value={ pageName}
              onChange={handlePageNameChange}
              className={'border-0 border-b focus:dark:border-neutral-100 focus:border-neutral-600 p-0'}
              placeholder="Enter page name"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="pageSlug" className={'sr-only'}>Page Slug</Label>
            <Input
              id="pageSlug"
              value={pageSlug}
              onChange={(e) => setPageSlug(e.target.value)}
              className={'border-0 border-b focus:dark:border-neutral-100 focus:border-neutral-600 p-0'}
              placeholder="Enter page slug"
            />
          </div>
         </div>
          <div className="space-y-2">
            <Label htmlFor="pageDesc" className={'sr-only'}>Page Description</Label>
            <Textarea
              id="pageDesc"
              value={pageDesc}
              onChange={(e) => setPageDesc(e.target.value)}
              className={'border-0 border-b focus:dark:border-neutral-100 focus:border-neutral-600 p-0'}
              placeholder="Enter page description"
              rows={3}
            />
          </div>
          {isPendingProject && <p className="text-sm text-muted-foreground">Loading...</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
         { 
         genBtnVisible &&
          <Button
            className='w-fit'
            onClick={handleCreatePage}
            disabled={!genBtnVisible || loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </Button>}
        </div>
      </div>

      {/* Tabs for Edit and Preview */}
      {pageData && (
        <section className='w-full flex flex-col gap-4'>
          {/* Tab Navigation */}
          <div className='border flex w-fit'>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 p-2 text-center ${activeTab === 'edit' ? 'bg-gray-200 dark:bg-neutral-800 ' : ''}`}
            >
              Edit
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 p-2 text-center ${activeTab === 'preview' ? 'bg-gray-200 dark:bg-neutral-800' : ''}`}
            >
              Preview
            </button>
          </div>

          {/* Tab Content */}
          <div className='border p-4 bg-neutral-200 dark:bg-neutral-900 w-full'>
              
   <div className="w-full max-w-full overflow-x-auto mb-4 ">
  <div className="flex flex-nowrap gap-4 ">
    <div className=" flex gap-2 items-center justify-start whitespace-nowrap px-3 p-1 bg-green-100 text-green-600 ">
      <h3 className="font-semibold  ">Project Name:</h3>
      <p className="text-sm truncate ">{pageData.projectName}</p>

    </div>
    <div className=" flex gap-2 items-center justify-start whitespace-nowrap px-3 p-1 bg-indigo-100 text-indigo-600 ">
      <h3 className="font-semibold t">Project Slug:</h3>
      <p className="text-sm truncate ">{pageData.projectSlug}</p>
    </div>
    <div className="flex gap-2 items-center justify-start whitespace-nowrap px-3 p-1 bg-teal-100 text-teal-600 ">
      <h3 className="font-semibold ">Page Name:</h3>
      <p className="text-sm truncate ">{pageName}</p>
    </div>
    <div className=" flex gap-2 items-center justify-start whitespace-nowrap  px-3 p-1 bg-violet-100 text-violet-600 ">
      <h3 className="font-semibold ">Page Slug:</h3>
      <p className="text-sm truncate ">{pageSlug}</p>
    </div>
  </div>
</div>

       
       {activeTab === 'edit' && (
              <div className='max-h-fit h-full flex flex-col gap-4 justify-start items-start w-full'>
                <MarkdownEditor 
                pageContent={pageContent} 
                setPageContent={setPageContent}/>
                <Button
                  onClick={handleSavePage}
                  disabled={isPendingPage}
                  className='w-fit'
                >
                  {isPendingPage ? 'Saving...' : 'Save Page'}
                </Button>
              </div>
            )}

            {activeTab === 'preview' && (

              <div className='max-h-fit h-full flex flex-col gap-4 justify-start items-start w-full' >
                <div className={'prose dark:prose-invert w-full max-w-full mt-8'}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className={'w-full'}>
                  {pageContent} 
                </ReactMarkdown>
                </div>
                <Button
                  onClick={handleSavePage}
                  disabled={isPendingPage}
                  className='w-fit'
                >
                  {isPendingPage ? 'Saving...' : 'Save Page'}
                </Button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
