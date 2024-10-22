"use server";

import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { createSlug } from "@/lib/utils";
import { ProjectCreatorSchema, ProjectEditSchema } from "@/schemas";


// Create the server action for page creation
export const createProject = async (values: z.infer<typeof ProjectCreatorSchema>) => {
    // Validate user authentication
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
     // Ensure the project slug is unique
    const newSlug = createSlug(values.slug?.trim().toLowerCase() || values.name);

    // Check if the slug already exists in the database
    const existingProject = await prisma.project.findUnique({
      where: { 
        userId_slug: {
          userId: user.id,
          slug: newSlug
        }
      }
    });

    if (existingProject) {
        return { error: "Project already exists" }
    }

  // Create the new page in the database
  const newData = await prisma.project.create({
    data: {
      slug: newSlug,
      userId: user.id,
      name: values.name,
      description: values.description || '',
    },
  });

  return { newData, success: "Project created successfully!" };
};



// Edit a project action
export const editProject = async (values: z.infer<typeof ProjectEditSchema>) => {
  
  
  // Validate user authentication
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Find the project to ensure it belongs to the authenticated user
  const existingProject = await prisma.project.findUnique({
    where: {
      userId_slug: {
        slug: values.slug,
        userId: user.id,
      },
    },
  });

  if (!existingProject) {
    return { error: "Project not found or unauthorized access" };
  }

  // Update the project in the database
  const updatedProject = await prisma.project.update({
    where: {
      id: existingProject.id,
      userId_slug: {
        slug: existingProject.slug,
        userId: user.id,
      },
    },
    data: {
      name: values.name,
      description: values.description,
    },
  });

  return { updatedProject, success: "Project updated successfully!" };
};





// Delete a project action
export const deleteProject = async (slug: string) => {
  
  // Validate user authentication
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Find the project to ensure it belongs to the authenticated user
  const existingProject = await prisma.project.findUnique({
    where: {
      userId_slug: {
        slug: slug,
        userId: user.id,
      },
    },
  });

  if (!existingProject) {
    return { error: "Project not found or unauthorized access" };
  }

  // Delete the project from the database
  await prisma.project.delete({
    where: {
      userId_slug: {
        slug: slug,
        userId: user.id,
      },
    },
  });

  return { success: "Project and associated pages deleted successfully!" };
};
