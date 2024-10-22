"use client"

import { useState, useTransition } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ProjectEditSchema } from "@/schemas"
import { deleteProject, editProject } from "@/actions/user/manage-project"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useToast} from "@/hooks/use-toast"



export default function ProjectsTable({projects}: {projects:any}) {

  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<any>("index")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [newProjectName, setNewProjectName] = useState("")
  const [pendingDeleteSlug, setPendingDeleteSlug] = useState<string | null>(null);


  const router = useRouter()
  const [error, setError] = useState<string | null>("");
  const [success, setSuccess] = useState<string | null>("");
  const [isPending, startTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const { toast } = useToast()
  
  // Filter projects based on search term
  const filteredProjects = projects?.filter((project:any) =>
    Object.values(project).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Handle sort
  const handleSort = (column:any) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Handle edit
  const handleEdit = (project: any) => {
    setNewProjectName(project.name)
  }

  // Handle save edit

  const handleEditSave = (values: z.infer<typeof ProjectEditSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
        editProject(values)
            .then((data) => {
                if (data.error) {
                    setError(data.error && 'Something went wrong');
                }

                if (data.success) {
                    setSuccess(data.success || 'Project name changed successfully');
                    toast({
                        title: "Success",
                        description: success || "Name changed successfully",
                      })
                }
            })
            .catch(() => {
                setError("Something went wrong!");
                toast({
                    title: "Error",
                    description: error || "Something went wrong!",
                  })
            }
        )
            .finally(()=> {
              router.refresh()
            })
    });
};

  // Handle delete
  const handleDelete = (slug: string) => {
    setError("");
    setSuccess("");
    setPendingDeleteSlug(slug)
    startDeleteTransition(() => {
        deleteProject(slug)
            .then((data) => {
                if (data.error) {
                    setError(data.error && 'Something went wrong');
                }

                if (data.success) {
                    
                    setSuccess(data.success || 'Project deleted successfully');
                    toast({
                        title: "Success",
                        description: success || "Deleted successfully",
                      })
                      
                }
            })
            .catch(() => {
                setError("Something went wrong!");
                toast({
                    title: "Error",
                    description: error || "Something went wrong!",
                  })
            }
        )
            .finally(()=> {
              router.refresh()
            })
    });
  }

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Table className="w-full ">
        <TableHeader className=" ">
          <TableRow className="w-full " >
            <TableHead className="flex-1 whitespace-nowrap " onClick={() => handleSort("index")}>
              Sl No.
              {sortColumn === "id" && (sortDirection === "asc" ? " ↑" : " ↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("name")} className="flex-1">
              Name
              {sortColumn === "name" && (sortDirection === "asc" ? " ↑" : " ↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("slug")} className="">
              Slug
              {sortColumn === "slug" && (sortDirection === "asc" ? " ↑" : " ↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("pageCount")} className="flex-1 whitespace-nowrap">
              No. of Pages
              {sortColumn === "pageCount" && (sortDirection === "asc" ? " ↑" : " ↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("createdAt")} className="flex-1 whitespace-nowrap">
              Created At
              {sortColumn === "createdAt" && (sortDirection === "asc" ? " ↑" : " ↓")}
            </TableHead>
            <TableHead className="flex-1 whitespace-nowrap justify-end flex">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects?.map((project, index) => (
            <TableRow key={project.id}>
              <TableCell className="whitespace-nowrap">{index+1}</TableCell>
              <TableCell className="whitespace-nowrap">{project.name}</TableCell>
              <TableCell className="whitespace-nowrap">{project.slug}</TableCell>
              <TableCell className="whitespace-nowrap">{project.pages.length}</TableCell>
              <TableCell className="whitespace-nowrap">{project.createdAt.toString()}</TableCell>
              <TableCell className="flex-1 whitespace-nowrap justify-end flex">
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="default" onClick={() => handleEdit(project)}>
                       Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[360px] sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-base">Edit Project name</DialogTitle>
                      </DialogHeader>
                      <div className="grid py-4 w-full">
                        <div className="flex items-center gap-4 w-full">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button disabled={isPending} type="button" onClick={()=>handleEditSave({name:newProjectName, slug:project.slug})}>
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button disabled={(project.slug===pendingDeleteSlug) && isDeletePending} variant="outline" size="icon" type="button" onClick={() => handleDelete(project.slug)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}