import * as z from "zod";

const requiredString = z.string().trim().min(1, "Required");


export const SettingsSchema = z.object({
  name: z.optional(z.string().min(4)),
  username: z.optional(z.string().min(4)),
  email: z.optional(z.string().email()),
})


  // Define a schema for validating incoming data
export const BannerSettingsSchema = z.object({
  is_visible: z.boolean(),
  description: z.string(),
  timer: z.string(),
  link: z.string(),
  bannerUsername: z.string(),
});


export const PageCreatorSchema = z.object({
  projectSlug: requiredString,
  name: z.string().min(3, "Title must be at least 3 characters").max(100),
  slug: z.string().optional(), // If slug is not provided, we will create one
  content: z.string().min(1, "Content is required"),
  isPublished: z.boolean().default(false).optional(),
});

export const PageEditSchema = z.object({
  projectSlug: requiredString,
  name: z.string().min(3, "Title must be at least 3 characters").max(100),
  slug: requiredString, // If slug is not provided, we will create one
  content: z.string().min(1, "Content is required"),
  isPublished: z.boolean().default(false).optional(),
});

export const ProjectCreatorSchema = z.object({
  name: z.string().min(3, "Title must be at least 3 characters").max(100),
  slug: z.string().optional(), // If slug is not provided, we will create one
  description: z.string().optional(),
});

export const ProjectEditSchema = z.object({
  name: z.string().min(3, "Title must be at least 3 characters").max(100),
  slug: requiredString, 
  description: z.string().optional(),
});