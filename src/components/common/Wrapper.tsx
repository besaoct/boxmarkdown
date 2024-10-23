"use client"

import { useEffect, useState } from 'react'
import {   Hexagon, Layers, LogOut, Menu, Moon, PackagePlus,  Settings, Sun, TrendingUp,  } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import Link from 'next/link'
import { PiMarkdownLogo } from 'react-icons/pi'
import { signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
// import Image from 'next/image'

export default function Dashboard({
    children, user
  }: Readonly<{
    children: React.ReactNode;
    user: any
  }>) {
  return (

      <DashboardContent user={user}>
        {children}
      </DashboardContent>

  )
}

function DashboardContent({
    children,user
  }: Readonly<{
    children: React.ReactNode;
    user: any
  }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter();
  const pathname = usePathname();

      // Close the menu when clicking the current page link
      const closeOnCurrent = (href: string) => {
        if (pathname === href) {
          setSidebarOpen(false);
        }
      };
 
  // UseEffect to close the sidebar when pathname changes
  useEffect(() => {
    setSidebarOpen(false);
}, [pathname]); 

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-neutral-900 text-sm" >
      {/* Sidebar */}
      <aside className={`bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white w-64 space-y-4 py-4 px-2
         absolute inset-y-0 left-0 top-12 md:top-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-50`}>
        {/* Logo */}
        <div className='p-2  font-extrabold w-full m-auto hidden md:flex text-xl gap-0 justify-start items-center'>
          
        <Link href={'/dashboard'} className='border p-1 px-2  border-foreground text-base font-extrabold flex items-center gap-1'>
           <span>BOX</span> <PiMarkdownLogo className='text-xl' /> 
        </Link>
   
        </div>
        <nav className="space-y-2">


          <Button onClick={()=>closeOnCurrent('/dashboard')} variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Hexagon className="h-5 w-5" />
              <span>Home</span>
            </Link>
          </Button>
          <Button onClick={()=>closeOnCurrent('/create')} variant="ghost" className="w-full justify-start" asChild>
            <Link href="/create" className="flex items-center space-x-2">
              <PackagePlus className="h-5 w-5" />
              <span>Create</span>
            </Link>
          </Button>
          <Button onClick={()=>closeOnCurrent('/pages')} variant="ghost" className="w-full justify-start" asChild>
            <Link href="/pages" className="flex items-center space-x-2">
              <Layers className="h-5 w-5" />
              <span>Pages</span>
            </Link>
          </Button>
          <Button onClick={()=>closeOnCurrent('/settings')} variant="ghost" className="w-full justify-start" asChild>
            <Link href="/settings" className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </Button>
        </nav>
      </aside>
  {/* Overlay */}
  {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-70 z-40"
          onClick={() => setSidebarOpen(false)} // Close sidebar when clicking on the overlay
        />
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-neutral-900 shadow-sm z-50">
          <div className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
           
            <Button variant="ghost" className="md:hidden p-0 m-0 hover:bg-transparent " onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
            <div className='p-2 font-extrabold w-full m-auto  md:hidden flex text-xl gap-1 justify-start items-center'>
            <Link href={'/dashboard'}  className='border p-1 px-2  border-foreground text-base font-extrabold flex items-center gap-1'>
           <span>BOX</span> <PiMarkdownLogo className='text-xl' /> 
           </Link>
           </div>
         
            <div className=" flex items-center justify-end w-full ">

              <button
        className="relative w-10 h-6 bg-gray-300 dark:bg-neutral-800 rounded-full p-1 transition-colors duration-300 focus:outline-none"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {/* The slider ball */}
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-neutral-950 flex items-center justify-center transition-transform duration-300 transform ${
            theme === 'dark' ? 'translate-x-4' : ''
          }`}
        >
          {/* Sun/Moon Icons inside the ball */}
          {theme === 'light' ? (
            <Sun className="h-4 w-4 text-orange-500" />
          ) : (
            <Moon className="h-4 w-4 text-neutral-300" />
          )}
        </div>
      </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-3 flex items-center text-sm rounded-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-neutral-500 w-10 h-10">
                    <span className="sr-only">Open user menu</span>
                    <Avatar className='w-8 h-8 border'>
                     {/* <Image width={100} height={100} src={user.image  ? user.image : '/logo.png'} alt='logo' className="mb-4" /> */}
                      <AvatarImage src={user?.image ? user.image : ''} alt="" />
                      <AvatarFallback>
                         {user.name  ? user.name[0].toUpperCase() : 'B'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className=''>
                 <p className='line-clamp-1 w-fit break-all'> {user.isBasic ? 'Basic' : user.isPro ? 'Pro' : user.isMember ? 'Member' : 'Free'} Account</p>
                    </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem  onClick={()=>router.push('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>router.push('/plans')}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                    <span>Upgrade</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>signOut()} className='cursor-pointer'>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 bg-gray-100 dark:bg-neutral-950 mx-auto w-full  overflow-y-auto overflow-x-hidden  p-6">
           {children}
        </main>
      </div>
    </div>
  )
}