import Razorpay from "razorpay";
import { currentUser } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  // Validate the request method
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await currentUser();
  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { planId } = await req.json();

  console.log("plan Id:", planId);

  try {
    // Create a Razorpay subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // Subscription period (monthly for 12 months)
      notes: {
        userId: user.id, // Send user ID in the notes for tracking
        userName:user.name,
        userEmail:user.email,
        userUsername:user.username
      },
    });

    // Send subscription details back to frontend
    return new Response(JSON.stringify({ subscription }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return new Response(JSON.stringify({ message: "Error creating subscription" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
