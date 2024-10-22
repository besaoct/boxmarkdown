'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react'
import { PageWithProjectType } from '@/lib/data'
import { useRouter } from 'next/navigation'

interface TableRowProps {
  item: PageWithProjectType
}

const TableRowComponent: React.FC<TableRowProps> = ({ item}) => {
  const router = useRouter();
  return(
    <TableRow key={item.id} className=''>
    <TableCell >
        <p className='max-w-96 truncate'>{item.name}</p>
        </TableCell>
    <TableCell>
   {item.project.name}
        </TableCell>
    <TableCell>{item.createdAt?.toISOString().split('T')[0] || 'N/A'}</TableCell>
    <TableCell className='text-xs'>
      {item.isPublished ? 
    <p className='text-green-800 bg-green-100 w-fit px-2 py-1 '>Published</p>
      : 
    <p className='text-orange-800 bg-orange-100 w-fit px-2 py-1 '>Draft</p>
      }
    </TableCell>
    <TableCell>{item.user.name}</TableCell>
    <TableCell>
      <Button variant="secondary" size="sm" onClick={() => router.push(`/pages/${item.project.slug}/${item.slug}`)}>
       Manage 
      </Button>
    </TableCell>
  </TableRow>)
}

export default function PagesTable({data}:{data: PageWithProjectType[] | null}) {

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [sortColumn, setSortColumn] = useState('page')
  const [sortDirection, setSortDirection] = useState('asc')

  // Filter and sort data
  const filteredAndSortedData = data
    ?.filter(item => {
    const status = item.isPublished ? 'Published' : 'Draft'
    return(
      (filterStatus === 'All' || status === filterStatus) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.project.name.toLowerCase().includes(searchTerm.toLowerCase()))

 )})
 .sort((a, b) => {

  const aValue = sortColumn === 'page' ? a.name :
                 sortColumn === 'project' ? a.project.name :
                 sortColumn === 'created' ? (a.createdAt || '') :
                 sortColumn === 'creator' ? (a.user.name || ''):
                 sortColumn === 'status' ? (a.isPublished ? 'Published' : 'Draft') :
                 ''; // Default case, 

  const bValue = sortColumn === 'page' ? b.name :
                 sortColumn === 'project' ? b.project.name :
                 sortColumn === 'created' ? (b.createdAt || '') :
                 sortColumn === 'creator' ? (b.user.name || '') :
                 sortColumn === 'status' ? (b.isPublished ? 'Published' : 'Draft') :
                 ''; // Default case,

  if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
  if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
  return 0;
});
  // Pagination
  const totalPages = (filteredAndSortedData && Math.ceil(filteredAndSortedData.length / itemsPerPage)) || 0
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredAndSortedData?.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }


  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-row justify-between gap-4 w-full">
      <div className="relative max-w-md w-full">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
      <Input
        placeholder="Search by page or project"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border w-full">
        <Table>
          <TableHeader className='bg-muted/30'>
            <TableRow>
              <TableHead>
                <Button variant="link" className='p-0' onClick={() => handleSort('page')}>
                  Page {sortColumn === 'page' && (sortDirection === 'asc' ? '↑' : '↓')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" className='p-0'  onClick={() => handleSort('project')}>
                  Project {sortColumn === 'project' && (sortDirection === 'asc' ? '↑' : '↓')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" className='p-0'  onClick={() => handleSort('created')}>
                  Created {sortColumn === 'created' && (sortDirection === 'asc' ? '↑' : '↓')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" className='p-0'  onClick={() => handleSort('status')}>
                  Status {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" className='p-0'  onClick={() => handleSort('creator')}>
                  Creator {sortColumn === 'creator' && (sortDirection === 'asc' ? '↑' : '↓')}
                </Button>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData?.map((item) => (
              <TableRowComponent key={item.id} item={item}  />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between w-full overflow-x-auto">
        <div className="flex items-center space-x-2 w-fit">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 w-fit">
          <p className="text-sm text-muted-foreground whitespace-nowrap px-4">
            Page {currentPage} of {totalPages}
          </p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}