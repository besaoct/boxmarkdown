
import { verifyRazorpaySignature, handleSubscriptionUpdate, handleInvoiceEvent } from "@/lib/webhookUtils"; // Utility functions

// Razorpay webhook API
export async function POST(req: Request) {
  // Razorpay sends a POST request, ensure it's correct
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Verify signature for security purposes
  const isValid = verifyRazorpaySignature(req);
  if (!isValid) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { event, payload } = await req.json();

  try {
    switch (event) {
      case "subscription.activated":
      case "subscription.updated":
        await handleSubscriptionUpdate(payload.subscription);
        break;

      case "invoice.paid":
        await handleInvoiceEvent(payload.invoice, "paid");
        break;

      case "invoice.expired":
        await handleInvoiceEvent(payload.invoice, "expired");
        break;

      case "subscription.cancelled":
        await handleSubscriptionUpdate(payload.subscription, "cancelled");
        break;

      default:
        console.log(`Unhandled event: ${event}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
