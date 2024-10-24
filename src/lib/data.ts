import { cache } from "react";
import { prisma } from "./prisma";
import { currentUser, currentUserPlan, getTotalAIgens, getUserByUsername } from "./auth";
import { Prisma } from "@prisma/client";
import { plans } from "./plan";


export const getPageLimit = async()=>{
  const currentPlan = await currentUserPlan()
  const PageLimit = currentPlan==='Free' ? plans.free.numberOfPages : 
  currentPlan === 'Basic' ?plans.basic.numberOfPages : 
  currentPlan === 'Pro' ? plans.pro.numberOfPages : 
  currentPlan === 'Member' ? plans.member.numberOfPages : 0;
  return PageLimit;
} 

export const getAIGenLimit = async()=>{
  const currentPlan = await currentUserPlan()
  const gens= currentPlan==='Free' ? (plans.free.numberOfAIgens): 
  currentPlan==='Basic' ? (plans.basic.numberOfAIgens):
  currentPlan==='Pro' ? (plans.pro.numberOfAIgens): 
  currentPlan==='Member' ? (plans.member.numberOfAIgens): 0

  return gens;
} 

export const getAIGenData = async()=>{
  const user = await currentUser();
  if (!user) {
    return null;
  }
  try {
    const data = await prisma.aiGen.findFirst({ where: { userId: user.id} });
    return data;
  } catch {
    return null;
  }
} 



// user project
export const getProjectBySlug = (async (slug: string) => {
    const user = await currentUser();
    if (!user) {
      return null;
    }
  
    try {
      const data = await prisma.project.findFirst({ where: { userId: user.id, slug } });
      return data;
    } catch {
      return null;
    }

  });

  export const getProjectById = (async (id: string) => {
    const user = await currentUser();
    if (!user) {
      return null;
    }
    try {
      const data = await prisma.project.findFirst({ where: { userId: user.id, id } });
      return data;
    } catch {
      return null;
    }

  });


  export const getAllProjects = async () => {

    const user = await currentUser();
    if (!user) {
      return null;
    }

    try {
      const data = await prisma.project.findMany({
        where:{
            userId: user.id,
        },
        include:{
            pages: true,
            user: true
        },
        
      });

      const res = data.map(projects => {
        return {
          ...projects,
          createdAt: projects.createdAt?.toISOString() || 'N/A',
          updatedAt: projects.updatedAt?.toISOString() || 'N/A'
        };
  });
  
      return res;


    } catch {
      return null;
    }
  };
  
  
  export const getAllProjectsWithPublishedPages = (async () => {
    const user = await currentUser();
    if (!user) {
      return null;
    }
    try {
      const data = await prisma.project.findMany({
        where:{
            userId: user.id
        },
        include:{
            pages: {
                where: {
                    isPublished: true
                }
            }
        }
      });
      return data;
    } catch {
      return null;
    }
  });

  export const getAllProjectsWherePublishedPages = (async () => {
    const user = await currentUser();
    if (!user) {
      return null;
    }
    try {
      const data = await prisma.project.findMany({
        where:{
            userId: user.id,
            pages: {
                some: {
                    isPublished: true
                }
            }
        },
        include:{
            pages: true
        }
      });
      return data;
    } catch {
      return null;
    }
  });


// user page

  export const getPageBySlugs = (async (slug: string, projectSlug:string) => {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    const project = await getProjectBySlug(projectSlug);
    if (!project) {
      return null;
    }

    try {
      const data = await prisma.page.findFirst({ 
        where: { userId: user.id, slug , projectId: project.id}, 
        include:{
            project: true,
            user:true,
            publicPageConfig:true
        } 
    });
      return data;
    } catch {
      return null;
    }

  });


  export const getAllPagesWithProject = (async () => {
    const user = await currentUser();
    if (!user) {
      return null;
    }
    try {
      const data = await prisma.page.findMany({
        where:{
            userId: user.id
        },
        include:{
            project: true,
            user: true,
            publicPageConfig: true 
        }
      });
      return data;
    } catch {
      return null;
    }
  });

// Get the payload type for `Page` model including relations
export type PageWithProjectType = Prisma.PageGetPayload<{
  include: { project: true; user: true, publicPageConfig: true }
}>;

  export const getPublishedPagesWithProject = cache(async () => {
    const user = await currentUser();
    if (!user) {
      return null;
    }
    try {
      const data = await prisma.page.findMany({
        where: {
            userId: user.id,
            isPublished: true
        },
        include:{
            project: true,
            user:true,
            publicPageConfig:true
        }
      });
      return data;
    } catch {
      return null;
    }
  });


  export const getDraftPagesWithProject = cache(async () => {
    const user = await currentUser();
    if (!user) {
      return null;
    }
    try {
      const data = await prisma.page.findMany({
        where: {
            isPublished: false
        },
        include: {
            project: true,
            user:true,
            publicPageConfig:true
        }
      });
      return data;
    } catch {
      return null;
    }
  });



//   public 


export const getPublicProjectBySlug = (async ({slug, username}:{slug: string, username:string}) => {

  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }

  try {
    const data = await prisma.project.findFirst({ where: { userId: user.id, slug } });
    return data;
  } catch {
    return null;
  }

});


export const getPublicPage = cache(async ({ slug, projectSlug, username}:{slug: string, projectSlug:string, username:string}) => {
    
    const user = await getUserByUsername(username);
    if (!user) {
      return null;
    }

    const project = await getPublicProjectBySlug({slug:projectSlug,username:username});
    
    if (!project) {
      return null;
    }

    try {
      const data = await prisma.page.findFirst({ 
        where: { 
            userId: user.id, 
            slug , 
            projectId: project.id,
            isPublished: true
        },
        
        select:{

          slug:true,
          name:true,
          content:true,
          createdAt:true,
          updatedAt:true,
          isPublished:true,

          project:{
            select:{
              name:true,
              slug:true,
            }
          },

          user:{
            select:{
              name:true,
              username:true,
              isBasic:true,
              isPro:true,
              isMember:true,
            }
          },

          publicPageConfig:true
        },
     
        
    } 
  );

      
      return data;
    } catch {
      return null;
    }

  });


// Define the return type of getPublicPage
export type PublicPageType = Awaited<ReturnType<typeof getPublicPage>>;



// private dashboard

export const getDashboardData =async()=>{

  const pagesData = await getAllPagesWithProject();
  const projects = await getAllProjects();
  const ActiveProjects =  await getAllProjectsWherePublishedPages();
  const currentPlan = await currentUserPlan();
  const PageLimit = await getPageLimit();
  const aiGenLimit = await getAIGenLimit();
  const totalAIGens = await getTotalAIgens();
  const aiGenData = await getAIGenData();

  return {
    pagesData,
    projects,
    ActiveProjects,
    currentPlan,
    PageLimit,
    aiGenLimit,
    totalAIGens,
    aiGenData
  }
}


