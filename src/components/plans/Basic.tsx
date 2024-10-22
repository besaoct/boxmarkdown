'use client'

import React from 'react'
import SubscriptionButton from './SubscriptionButton'
import { plans } from '@/lib/plan'
import { useRouter, useSearchParams } from 'next/navigation'
import { BASE_URL } from '@/routes'

const BasicPlan = ({ user }: { user: any }) => {
  const subscribed = user.isBasic || user.isPro || user.isMember;
  const planId = plans.basic.planId
  const router = useRouter()
  const redirectUrl = useSearchParams().get('redirectUrl')

  const newUrl = redirectUrl ? `${BASE_URL}/${decodeURIComponent(redirectUrl)}` : `/create`

  if (subscribed) {
    router.push(newUrl)  
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <h2 className="text-base font-medium">Basic Plan Details</h2>
      <p className="text-muted-foreground">
        The Basic Plan is designed for users who need more resources and features compared to the Free Plan. Here are the key benefits:
      </p>

      <ul className="list-disc list-inside">
        <li>📄 Up to {plans.basic.numberOfPages} Markdown pages</li>
        <li>🔄 {plans.basic.numberOfAIgens} AI generations per month</li>
        <li>✏️ Page editing capabilities</li>
        <li>🌐 Public URL for sharing your projects</li>
      </ul>

      <p className="text-muted-foreground">
        Monthly Price: <strong>₹{plans.basic.monthlyPrice}</strong>
      </p>

      <p className="text-muted-foreground">
        Subscribe to the Basic Plan today to unlock these features and more!
      </p>

      <SubscriptionButton planId={planId} user={user} />
    </div>
  )
}

export default BasicPlan
