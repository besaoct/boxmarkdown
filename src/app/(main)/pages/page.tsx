import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {  Eye, EyeOff, Layers, Plus } from "lucide-react";
import Link from "next/link";
import { getAllPagesWithProject, getAllProjects, getPageLimit } from '@/lib/data';
import {  currentUserPlan } from "@/lib/auth";
import PagesTable from "@/components/pages/PagesTable";
import ProjectsTable from "@/components/pages/ProjectsTable";



// Reusable SummaryCard component
const SummaryCard = ({ title, value, desc, Icon }: { title: string; value: number; desc: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </CardContent>
  </Card>
);


export default async function page() {

const pagesData = await getAllPagesWithProject();
const projectsData = await getAllProjects()
const publishedPages = pagesData?.filter((pages)=>pages.isPublished===true)
const draftPages = pagesData?.filter((pages)=>pages.isPublished===false)

const currentPlan = await currentUserPlan()
const PageLimit = await getPageLimit()

const PagesLeft = PageLimit - (pagesData?.length || 0)

  // Data for the summary cards
  const summaryData = [
    { title: "Total Pages", value: pagesData?.length || 0, desc: `${PagesLeft<0 ? '0' : PagesLeft} ${currentPlan} pages left`, icon: Layers },
    { title: "Active Pages", value: publishedPages?.length || 0, desc: `Of ${pagesData?.length || 0} total pages`, icon: Eye },
    { title: "Draft Pages", value: draftPages?.length || 0, desc:`Of ${pagesData?.length || 0} total pages`, icon: EyeOff},
  ];
  return (
    <>
      <div className="mx-auto w-full flex flex-col  gap-4">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {summaryData.map(({ title, value, desc, icon: Icon }, index) => (
            <SummaryCard key={index} title={title} value={value} desc={desc} Icon={Icon} />
          ))}
        </div>


               {/* Pages Table */}
               <Card className="">
          <CardHeader>
            <CardTitle>All Pages</CardTitle>
            <CardDescription>Your created pages</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="overflow-x-auto">
              <PagesTable data={pagesData}/>
            </div>
         
          </CardContent>
        </Card>



   
       {/* Projects Table */}
       <Card className="">
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>Your created projects</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="overflow-x-auto">
              <ProjectsTable projects={projectsData}/>
            </div>
         
          </CardContent>
        </Card>

                {/* Create New Page Button */}
          <div className="text-right">
         <Link href="/create">
         <Button className="">
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
         </Link>
        </div>

      </div>
    </>
  );
}
