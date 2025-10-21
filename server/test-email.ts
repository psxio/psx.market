/**
 * Email Service Test Script
 * 
 * Run this to test the email service:
 * npx tsx server/test-email.ts
 */

import { getEmailService } from "./email/service";
import {
  orderUpdateEmail,
  newMessageEmail,
  paymentReceivedEmail,
  newReviewEmail,
  milestoneUpdateEmail,
} from "./email/templates/notifications";

async function testEmailService() {
  console.log("\n🧪 Testing create.psx Email Service\n");
  console.log("=" .repeat(60));
  
  const emailService = getEmailService();
  
  // Test 1: Basic Email
  console.log("\n1️⃣  Testing Basic Email...\n");
  await emailService.send({
    to: { email: "client@example.com", name: "John Doe" },
    subject: "Welcome to create.psx",
    html: "<h1>Welcome!</h1><p>Thank you for joining create.psx</p>",
    text: "Welcome! Thank you for joining create.psx",
  });
  
  // Test 2: Order Update Email
  console.log("\n2️⃣  Testing Order Update Template...\n");
  const orderEmail = orderUpdateEmail({
    recipientName: "Alice Client",
    orderId: "ord_123456",
    orderTitle: "Premium Logo Design",
    status: "completed",
    builderName: "Bob Designer",
  });
  
  await emailService.send({
    to: { email: "alice@example.com", name: "Alice Client" },
    subject: "Order Completed - Premium Logo Design",
    html: orderEmail.html,
    text: orderEmail.text,
  });
  
  // Test 3: New Message Email
  console.log("\n3️⃣  Testing New Message Template...\n");
  const messageEmail = newMessageEmail({
    recipientName: "Alice Client",
    senderName: "Bob Designer",
    messagePreview: "I've completed the initial drafts and would love to get your feedback!",
    threadId: "thread_789",
  });
  
  await emailService.send({
    to: { email: "alice@example.com", name: "Alice Client" },
    subject: "New Message from Bob Designer",
    html: messageEmail.html,
    text: messageEmail.text,
  });
  
  // Test 4: Payment Received Email
  console.log("\n4️⃣  Testing Payment Received Template...\n");
  const paymentEmail = paymentReceivedEmail({
    recipientName: "Bob Designer",
    amount: "$500 USDC",
    orderId: "ord_123456",
    orderTitle: "Premium Logo Design",
    transactionId: "0x1234...5678",
  });
  
  await emailService.send({
    to: { email: "bob@example.com", name: "Bob Designer" },
    subject: "Payment Received - $500 USDC",
    html: paymentEmail.html,
    text: paymentEmail.text,
  });
  
  // Test 5: New Review Email
  console.log("\n5️⃣  Testing New Review Template...\n");
  const reviewEmail = newReviewEmail({
    recipientName: "Bob Designer",
    reviewerName: "Alice Client",
    rating: 5,
    reviewPreview: "Absolutely fantastic work! Bob exceeded all my expectations.",
    builderId: "builder_456",
  });
  
  await emailService.send({
    to: { email: "bob@example.com", name: "Bob Designer" },
    subject: "New 5-Star Review!",
    html: reviewEmail.html,
    text: reviewEmail.text,
  });
  
  // Test 6: Milestone Update Email
  console.log("\n6️⃣  Testing Milestone Update Template...\n");
  const milestoneEmail = milestoneUpdateEmail({
    recipientName: "Alice Client",
    milestoneName: "Initial Concept Designs",
    orderId: "ord_123456",
    orderTitle: "Premium Logo Design",
    status: "approved",
  });
  
  await emailService.send({
    to: { email: "alice@example.com", name: "Alice Client" },
    subject: "Milestone Approved - Initial Concept Designs",
    html: milestoneEmail.html,
    text: milestoneEmail.text,
  });
  
  console.log("\n" + "=".repeat(60));
  console.log("\n✅ All email tests completed successfully!\n");
  console.log("📧 Check the console output above to see the email content.\n");
  console.log("💡 To use a real email provider:");
  console.log("   1. Set SENDGRID_API_KEY (or other provider credentials)");
  console.log("   2. Run this script again");
  console.log("   3. Check your inbox!\n");
}

testEmailService().catch((error) => {
  console.error("\n❌ Email test failed:", error);
  process.exit(1);
});
