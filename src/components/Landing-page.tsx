'use client'

import { FC, useEffect, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Globe,  Sun} from "lucide-react"
import { PiMarkdownLogo} from "react-icons/pi"
import { motion, Variants } from "framer-motion"
import { CgEditMarkup } from "react-icons/cg";
import { useTheme } from "next-themes"
import WaveDivider from "@/components/common/WaveDivider"
import { MoonIcon } from "@radix-ui/react-icons"
import HoverVideo from "@/components/videos/HeroVideo"
import { useRouter } from "next/navigation"
import Plans from "./common/Plans"
import { sendMessage } from "@/actions/contact/sendmail"
import { toast } from "@/hooks/use-toast"

// Type Definitions
interface Feature {
  icon: FC<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
}




// Animation Variants
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
}

const staggerChildren: Variants = {
  visible: { 
    transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
  }
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
}

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
}

// Feature and Pricing Data
const features: Feature[] = [
  {
    icon: CheckCircle,
    title: "AI-Powered Generation",
    description: "Create markdown content effortlessly using our advanced AI technology."
  },
  {
    icon: CgEditMarkup,
    title: "Easy Editing",
    description: "Edit and refine your markdown pages with our intuitive editor."
  },
  {
    icon: Globe,
    title: "Instant Publishing",
    description: "Preview and publish your pages to a public URL with a single click."
  },
]


// Main Component
const EnhancedLandingPage: FC = () => {
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState<string>("")
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({})


  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();
   
  useEffect(() => {

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    Object.values(sectionsRef.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()


  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
  

   startTransition(() => {
      sendMessage({
          name,
          email,  
          message,
        })
        .then((data) => {
  
         if (data.success) {
              // If successful, you can reset the form or show a success message
              form.reset();
              console.log('Message sent successfully!');
              toast({
                title:"Success",
                description:"Message sent successfully!"
              })
         }
        }).catch(() => {
          toast({
            title:"Error",
            description:"Something went wrong!"
          })
        })

      })
  
  };
  

  return (
    <div className="flex flex-col min-h-screen w-full mx-auto">
      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm border-b"
      >
        <Link href="#">
          <div className='p-2 font-extrabold w-full m-auto flex text-xl gap-1 justify-start items-center'>
          <div className='border p-1 px-2  border-foreground text-base font-extrabold flex items-center gap-1'>
           <span>BOX</span> <PiMarkdownLogo className='text-xl' /> 
        </div>
          </div>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
        <button
        className="relative w-10 h-6 bg-gray-300 dark:bg-neutral-800 rounded-full p-1 transition-colors duration-300 focus:outline-none"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {/* The slider ball */}
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-neutral-950 flex items-center justify-center transition-transform duration-300 border dark:border-neutral-500 p-1 transform ${
            theme === 'dark' ? 'translate-x-4' : ''
          }`}
        suppressHydrationWarning >
          {/* Sun/Moon Icons inside the ball */}
          {theme === 'dark' ? (
            <MoonIcon className="h-4 w-4 text-neutral-300" />
          ) : (
            <Sun className="h-4 w-4 text-orange-500" />
          )}
        </div>
      </button>
          {["features", "pricing", "contact"].map((item) => (
            <Link
              key={item}
              className={`hidden sm:block text-sm font-medium hover:underline underline-offset-4 transition-colors ${
                activeSection === item ? "text-primary" : "text-muted-foreground"
              }`}
              href={`#${item}`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </nav>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 pt-16 w-full ">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 mx-auto flex flex-col justify-center items-center "
        >
          <div className="px-4 md:px-6 w-full ">
            <div className="flex flex-col items-center space-y-6 text-center ">
              <motion.div variants={fadeIn} className="space-y-4">
                <div className="text-2xl font-extrabold w-full sm:text-4xl md:text-5xl lg:text-6xl flex flex-col">
                  <span className={`text-xl sm:text-3xl font-thin text-muted-foreground `}>Create edit & publish</span>
                  <span className="h-fit ">
                    Markdown Pages with AI
                  </span>
                </div>
                <p className="mx-auto text-muted-foreground text-sm md:text-lg max-w-2xl">
                  BOXmarkdown lets you generate beautiful web pages using AI-powered markdown creation. Edit, preview, and publish with ease.
                </p>
              </motion.div>
              <motion.div 
                variants={fadeIn} 
                className="space-x-4 flex flex-wrap justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button size="lg" onClick={()=>router.push('/login')}>Get Started</Button>
            
              </motion.div>

              <div>
              
                <HoverVideo/>
            
              </div>
            </div>
          </div>

        </motion.section>

   
<WaveDivider height={50} />
        {/* Features Section */}
        <motion.section
          ref={(el:any) => (sectionsRef.current.features = el)}
          id="features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="w-full py-12 md:py-24 lg:py-32 bg-muted justify-center flex flex-col items-center"
        >
          <div className="px-4 md:px-6 max-w-7xl mx-auto">
            <motion.h2 
              variants={fadeIn} 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
            >
              Features
            </motion.h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeIn}
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        <feature.icon className="h-6 w-6 mr-2 text-primary" />
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        {/* Pricing Section */}

        <motion.section
          ref={(el:any) => (sectionsRef.current.pricing = el)}
          id="pricing"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="w-full py-12 md:py-24 lg:py-32 "
        >
          <div className="px-4 md:px-6 max-w-7xl mx-auto">
            <motion.h2 
              variants={fadeIn} 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
            >
              Pricing Plans
            </motion.h2>
             <Plans/>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
      ref={(el: any) => (sectionsRef.current.contact = el)}
      id="contact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerChildren}
      className="w-full py-12 md:py-24 lg:py-32 bg-muted"
    >
      <div className="px-4 md:px-6 max-w-3xl mx-auto">
        <motion.h2 
          variants={fadeIn} 
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
        >
          Contact Us
        </motion.h2>
        <motion.div 
          variants={fadeIn} 
          className="max-w-md mx-auto"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card>
            <CardContent className="pt-6">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      className="w-full px-3 py-2 border focus:outline-none focus:ring-1 focus:ring-muted"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      className="w-full px-3 py-2 border focus:outline-none focus:ring-1 focus:ring-muted"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      className="w-full px-3 py-2 border focus:outline-none focus:ring-1 focus:ring-muted"
                      placeholder="Enter your message"
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              ) : (
                <p className="text-center text-green-600">
                  Thank you! Your message has been sent.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        initial="hidden"
        animate="visible"
        variants={footerVariants}
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t "
      >
<div className="flex flex-col gap-2 items-center sm:items-start justify-center text-xs text-muted-foreground">
<div>
            A <Link href={'https://horofy.com'} className="inline text-red-500 underline">Horofy</Link> product.
         </div>
        <p className="text-xs text-muted-foreground">© 2024 BOXmarkdown. All rights reserved.</p>
</div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link 
            href="https://boxmarkdown.com/main/legal/terms" 
            className="text-xs hover:underline underline-offset-4 transition-colors text-muted-foreground"
          >
            Terms of Service
          </Link>
          <Link 
            href="https://boxmarkdown.com/main/legal/privacy-policy" 
            className="text-xs hover:underline underline-offset-4 transition-colors text-muted-foreground"
          >
            Privacy
          </Link>
        </nav>
      </motion.footer>
    </div>
  )
}

export default EnhancedLandingPage
