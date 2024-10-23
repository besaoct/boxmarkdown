import { loadRazorpay } from "@/lib/loadRazorpay";
import { useState } from "react";
import { Button } from "../ui/button";
import { SiRazorpay } from "react-icons/si";

export default function SubscriptionButton({ planId, user }: { planId: string , user:any}) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Make a request to the backend to create a subscription
      const res = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const { subscription } = await res.json();

      // Open Razorpay Checkout with the subscription details
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscription.id,
        name: "BOXmarkdown",
        description: "Subscription Plan",
        handler: async function (response: any) {
          // Handle successful subscription here (e.g., save in database)
          console.log("Subscription success", response);
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
      };

      const razorpay = await loadRazorpay();
      const rzp = new razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Subscription failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSubscribe} disabled={loading} className="gap-1 items-center w-fit">
     <SiRazorpay size={24} /> {loading ? "Processing..." : "Continue"}
    </Button>
  );
}
