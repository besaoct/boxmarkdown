"use server";

import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser, currentUserPlan } from "@/lib/auth";
import { createSlug } from "@/lib/utils";
import { PageCreatorSchema, PageEditSchema } from "@/schemas";
import { getAllPagesWithProject, getProjectBySlug } from "@/lib/data";
import { plans } from "@/lib/plan";


// Create the server action for page creation
export const createPage = async (values: z.infer<typeof PageCreatorSchema>) => {
  // Validate user authentication
  const user = await currentUser();
  const numberOfUserPages = (await getAllPagesWithProject())?.length || 0;
  const currentPlan = await currentUserPlan();
  
  
  if (!user) {
    return { error: "Unauthorized" };
  }

  const project =  await getProjectBySlug(values.projectSlug);
  if (!project) {
    return { error: "No project found" }
}

  // Ensure the page slug is unique
  let newSlug = values.slug?.trim().toLowerCase() ? createSlug(values.slug?.trim().toLowerCase()) : createSlug(values.name, user.username, true);
  let isUnique = false;

  while (!isUnique) {
    // Check if the slug already exists in the database
    const existingPage = await prisma.page.findFirst({
      where: { slug: newSlug, projectId : project.id, userId: user.id }
    });

    if (!existingPage) {
      isUnique = true;
    } else {
      // If not unique, modify the slug (e.g., by appending a number or re-generating)
      newSlug = createSlug(values?.slug || values.name, user.username, true);
    }
  }


  if ((currentPlan==='Free') && (numberOfUserPages >= plans.free.numberOfPages)) {
    return { error: "Please Upgrade your plan" };
  }

  if ( (currentPlan==='Basic') && (numberOfUserPages >= plans.basic.numberOfPages)) {
    return { error: "Please Upgrade your plan" };
  }


  if ( (currentPlan==='Pro') && (numberOfUserPages >= plans.pro.numberOfPages)) {
    return { error: "Please contact us to upgrade your plan" };
  }


  if ( (currentPlan==='Member') && (numberOfUserPages >= plans.member.numberOfPages)) {
    return { error: "Please contact us to upgrade your plan" };
  }

  // Create the new page in the database
  const newPage = await prisma.page.create({
    data: {
      slug: newSlug,
      userId: user.id,
      projectId: project.id,
      name: values.name,
      content: values.content,
      isPublished: values.isPublished,
    },
  });

  return { newPage, success: "Page created successfully!" };
};


// Create the server action for publishing a page
export const publishPage = async ({slug, projectSlug}:{slug: string, projectSlug:string}) => {
  
  // Validate user authentication
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const project = await getProjectBySlug(projectSlug);
  if (!project) {
    return { error: "No project found" }
  }

  // Find the page by ID and ensure it belongs to the authenticated user
  const existingPage = await prisma.page.findUnique({
    where: {
      userId_projectId_slug:{
        slug,
        projectId: project.id,
        userId: user.id,
      }
    },
  });

  if (!existingPage) {
    return { error: "Page not found or unauthorized access" };
  }


  // Update the page's `isPublished` field to true
  const publishedPage = await prisma.page.update({
    where: {
      userId_projectId_slug: {
        slug: existingPage.slug,
        projectId: existingPage.projectId,
        userId: user.id,
      },
    },
    data: {
      isPublished: !(existingPage.isPublished),
      updatedAt: new Date(), // Set `updatedAt` to the current time for tracking
    },
  });

  return { publishedPage, success: "Page published successfully!" };
};


// Create the server action for deleting a page
export const deleteMyPage = async (id:string) => {
  
  // Validate user authentication
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Find the page to ensure it belongs to the authenticated user
  const existingPage = await prisma.page.findUnique({
    where: {
        id,
        userId: user.id,
    }
  });

  if (!existingPage) {
    return { error: "Page not found or unauthorized access" };
  }

  // Delete the page from the database
  await prisma.page.delete({
    where: {
      id:existingPage.id,
      userId: user.id,
  }
  });

  return { success: "Page deleted successfully!" };
};



// Create the server action for editing a page
export const editPage = async (pageId:string, values: z.infer<typeof PageEditSchema>) => {

  const user = await currentUser();
  const numberOfUserPages = (await getAllPagesWithProject())?.length || 0;
  const currentPlan = await currentUserPlan();
  
  
  // Validate user authentication
  if (!user) {
    return { error: "Unauthorized" };
  }

  const project = await getProjectBySlug(values.projectSlug);
  if (!project) {
    return { error: "No project found" };
  }

  // Find the page by ID and ensure it belongs to the authenticated user
  const existingPage = await prisma.page.findUnique({
    where: {
        id: pageId,
        userId: user.id,
    },
  });
  if (!existingPage) {
    return { error: "Page not found or unauthorized access" };
  }

  // Ensure the slug is unique if it's being updated
  let newSlug = values.slug.trim().toLowerCase() ? createSlug(values.slug.trim().toLowerCase()) : createSlug(values.name, user.username, true);

  let isUnique = false;

  while (!isUnique) {
    const pageWithSlug = await prisma.page.findFirst({
      where: { 
        slug: newSlug, 
        projectId: project.id, 
        userId: user.id 
      }
    });

    if (!pageWithSlug || (pageWithSlug.id === existingPage.id)) {
      isUnique = true;
    } else {
      newSlug = createSlug(values.slug || values.name, user.username, true);
    }
  }


  if ((currentPlan==='Free') && (numberOfUserPages >= plans.free.numberOfPages)) {
    return { error: "Please Upgrade your plan" };
  }

  if ( (currentPlan==='Basic') && (numberOfUserPages >= plans.basic.numberOfPages)) {
    return { error: "Please Upgrade your plan" };
  }


  if ( (currentPlan==='Pro') && (numberOfUserPages >= plans.pro.numberOfPages)) {
    return { error: "Please contact us to upgrade your plan" };
  }


  if ( (currentPlan==='Member') && (numberOfUserPages >= plans.member.numberOfPages)) {
    return { error: "Please contact us to upgrade your plan" };
  }

  // Update the page in the database
  const updatedPage = await prisma.page.update({
    where: {
        id:pageId,
        userId: user.id,
    },
    data: {
      slug: newSlug,
      projectId: project.id,
      name: values.name,
      content: values.content,
      isPublished: values.isPublished,
      updatedAt: new Date(),
    },
  });

  return { updatedPage, success: "Page updated successfully!" };
};


// Create the server action for setting page config
export const editPageConfig = async (
  pageId: string, 
  values: { 
    arrObj?: string[],
    displayName?: string, 
    contactMail?: string,
    contactLink?: string,
    projectName?: string, 
    externalLink?: string
    toggleDarkmode?: boolean
    showAuthor?: boolean,
  }
) => {

  const user = await currentUser();

  // Validate user authentication
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Find the page by ID and ensure it belongs to the authenticated user
  const existingPage = await prisma.page.findFirst({
    where: {
      id: pageId,
      userId: user.id,
    },
  });

  if (!existingPage) {
    return { error: "Page not found or unauthorized access" };
  }

  // Update the page config or create if it doesn't exist
  const PageConfig = await prisma.publicPageConfig.upsert({
    where: {
      pageId: pageId,
    },
    update: {
      arrObj:values.arrObj ?? [],
      displayName: values.displayName ?? undefined,
      contactMail: values.contactMail ?? undefined,
      contactLink: values.contactLink ?? undefined,
      projectName: values.projectName ?? undefined,
      toggleDarkmode: values.toggleDarkmode ?? undefined,
      showAuthor:  values.showAuthor ?? undefined,
      updatedAt: new Date(),
    },
    create: {
      pageId: pageId,
      arrObj: values.arrObj ?? [],
      displayName: values.displayName ?? '',
      contactMail: values.contactMail ?? '',
      contactLink: values.contactLink ?? '',
      projectName: values.projectName ?? '',
      toggleDarkmode: values.toggleDarkmode ??  true,
      showAuthor: values.showAuthor ?? true,
      updatedAt: new Date(),
    }
  });

  return { PageConfig, success: "Page Config updated successfully!" };
};
