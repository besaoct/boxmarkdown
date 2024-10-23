import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUserPlan, getTotalAIgens } from "@/lib/auth";
import { getAIGenData, getAIGenLimit, getAllPagesWithProject, getAllProjects, getAllProjectsWherePublishedPages, getPageLimit } from "@/lib/data";
import { Bot, Box, Layers, Plus } from "lucide-react";
import Link from "next/link";


// Reusable SummaryCard component
const SummaryCard = ({ title, value, desc, Icon }: { title: string; value: string| number; desc: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }) => (
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

// Reusable TableRow component
const TableRow = ({ page, project, projectSlug, slug, created, status, statusColor}: 
  { page: string;slug: string; project: string; projectSlug: string; 
  created: string; status: string; statusColor: string; }
) => (
  <tr className="bg-white border-b dark:bg-neutral-800 dark:border-gray-700">
    <th scope="row" className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap dark:text-white">{page}</th>
    <td className="px-6 py-4">{project}</td>
    <td className="px-6 py-4">{created}</td>
    <td className="px-6 py-4">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>{status}</span>
    </td>
    <td className="px-6 py-4">
      <Link href={`/pages/${projectSlug}/${slug}`}>
      <Button className="btn"  size="sm">Manage</Button>
      </Link>
    </td>
  </tr>
);

export default async function Home() {
  const pagesData = await getAllPagesWithProject()
  const projects = await getAllProjects();
  const ActiveProjects =  await getAllProjectsWherePublishedPages()
  
  const currentPlan = await currentUserPlan()
  const PageLimit = await getPageLimit()
  const aiGenLimit = await getAIGenLimit()
  const totalAIGens = await getTotalAIgens()
  const aiGenData = await getAIGenData()
  
  const PagesLeft = (PageLimit - (pagesData?.length || 0));
  const AiGensLeft = (aiGenLimit - totalAIGens);

    // Data for the summary cards
    const summaryData = [
      { title: "Total Pages", value: pagesData?.length || 0, desc: `${PagesLeft<=0?'0':PagesLeft} ${currentPlan} pages left`, icon: Layers },
      { title: "Total AI Generations", value: totalAIGens , desc: `${AiGensLeft<=0?'0':AiGensLeft} generations left; ${aiGenData?.daysLeftCount  && `renewal in ${aiGenData?.daysLeftCount} days.`}`, icon: Bot },
      { title: "Active Projects", value: ActiveProjects?.length || 0, desc:`Of ${projects?.length||0} total projects`, icon: Box },
    ];

  

  return (
    <>
      <div className="mx-auto w-full">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
          {summaryData.map(({ title, value, desc, icon: Icon }, index) => (
            <SummaryCard key={index} title={title} value={value} desc={desc} Icon={Icon} />
          ))}
        </div>

        {/* Recent Pages Table */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Recent Pages</CardTitle>
            <CardDescription>Your most recently created pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-neutral-500 dark:text-neutral-400">
                <thead className="text-xs text-neutral-700 uppercase bg-neutral-50 dark:bg-neutral-700 dark:text-neutral-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Page</th>
                    <th scope="col" className="px-6 py-3">Project</th>
                    <th scope="col" className="px-6 py-3">Created</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagesData?.slice(0, 5).map((row, index) => (
                    <TableRow key={index} page={row.name} project={row.project.name} 
                    created={row.createdAt ? row.createdAt.toLocaleDateString() : "N/A"} 
                    status={row.isPublished ? "Published" : "Draft"}
                    slug={row.slug}
                    projectSlug={row.project.slug}
                    statusColor={row.isPublished ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"} />
                  ))}
                </tbody>
              </table>
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
