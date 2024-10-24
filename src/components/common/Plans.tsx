'use client'
import React from 'react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle} from "lucide-react"

import { motion, Variants } from "framer-motion"
import Link from 'next/link'


const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  }

interface PricingPlan {
    title: string
    price: string
    features: string[]
    hide?: string | boolean
    link:string
  }
  
  
  
  const Plans = ({userData}:any) => {
   
    const user = userData
    const pricingPlans: PricingPlan[] = [
      { 
        title: "Free", 
        price: "₹0", 
        features: ["1 Markdown page", "10 AI generations / month", "Page Editing", "Public URL"],
        hide:  !!user?.username,
        link: (!!user?.username) ? '/create' : `/login?redirectUrl=${encodeURIComponent('/create')}`
      },
      { 
        title: "Basic", 
        price: "₹9", 
        features: ["10 Markdown pages", "100 AI generations / month", "Page Editing","Public URL" ] ,
        link: (user?.username  ? 
                     `/plans/basic?redirectUrl=${encodeURIComponent('/create')}` : 
                     `/login?redirectUrl=${encodeURIComponent('/plans/basic')}`)
      },
      { 
        title: "Pro", 
        price: "₹99", 
        features: ["100 Markdown pages", "1000 AI generations / month", "Premium Page Editor", "Subdomain support"] ,
        link: (user?.username ? 
            `/plans/pro?redirectUrl=${encodeURIComponent('/create')}` : 
            `/login?redirectUrl=${encodeURIComponent('/plans/pro')}`)
      },
    ]

  return (
    <div className="flex flex-row items-start gap-4 justify-start h-fit flex-wrap">
    {pricingPlans.map((plan, index) => (
 
     <motion.div 
        key={index} 
        variants={fadeIn}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={` ${plan.hide ? 'hidden' : ''} flex-1 min-w-fit sm:min-w-[24rem] h-full`}
      >
        <Card className="h-full flex flex-col hover:bg-muted duration-300 transition-all ease-in-out">
          <CardHeader>
            <CardTitle className="text-2xl">{plan.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-4xl font-bold text-primary">{plan.price}</p>
            <p className="text-muted-foreground">per month</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-rose-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <div className="p-4">
           <Link href={plan.link}>
           <Button className="w-full">
              {plan.title === "Free" && "Get Started" ||
              plan.title === "Basic" && "Upgrade to Basic" ||
              plan.title === "Pro" && "Upgrade to Pro"
              }
            </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    ))}
  </div>
  )
}

export default Plans