'use client'

import React from 'react'
import SubscriptionButton from './SubscriptionButton'
import { plans } from '@/lib/plan'
import { useRouter, useSearchParams } from 'next/navigation'
import { BASE_URL } from '@/routes'

const ProPlan = ({ user }: { user: any }) => {
  const subscribed = user.isPro || user.isMember;
  const planId = plans.pro.planId
  const router = useRouter()
  const redirectUrl = useSearchParams().get('redirectUrl')

  const newUrl = redirectUrl ? `${BASE_URL}/${decodeURIComponent(redirectUrl)}` : `/create`

  if (subscribed) {
    router.push(newUrl)  
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <h2 className="text-base font-medium">Pro Plan Details</h2>
      <p className="text-muted-foreground">
        The Pro Plan is designed for advanced users who require enhanced capabilities and resources. Here are the key benefits:
      </p>

      <ul className="list-disc list-inside">
        <li>📄 Up to {plans.pro.numberOfPages} Markdown pages</li>
        <li>🔄 {plans.pro.numberOfAIgens} AI generations per month</li>
        <li>✏️ Premium page editing capabilities</li>
        <li>🌐 Custom domain support</li>
        <li>🚀 Priority support</li>
      </ul>

      <p className="text-muted-foreground">
        Monthly Price: <strong>₹{plans.pro.monthlyPrice}</strong>
      </p>

      <p className="text-muted-foreground">
        Upgrade to the Pro Plan today for these amazing features and more!
      </p>

      <SubscriptionButton planId={planId} user={user} />
    </div>
  )
}

export default ProPlan
