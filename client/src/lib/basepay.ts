import { pay, getPaymentStatus } from "@base-org/account";
import type { PaymentStatusOptions } from "@base-org/account";

export interface PaymentParams {
  amount: string;
  recipient: string;
  testnet?: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  paymentId?: string;
}

export async function processPayment(params: PaymentParams): Promise<PaymentResult> {
  try {
    const paymentResult = await pay({
      amount: params.amount,
      to: params.recipient,
      testnet: params.testnet !== false,
    });

    const paymentId = typeof paymentResult === 'string' 
      ? paymentResult 
      : String(paymentResult);

    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      const statusOptions: PaymentStatusOptions = { id: paymentId };
      const status = await getPaymentStatus(statusOptions);
      
      if (typeof status === 'object' && status && 'hash' in status) {
        return {
          success: true,
          paymentId,
          transactionHash: String((status as any).hash || paymentId),
        };
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }

    return {
      success: true,
      paymentId,
      transactionHash: paymentId,
    };
  } catch (error) {
    console.error("Base Pay error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment failed",
    };
  }
}

export function formatUSDCAmount(amount: number): string {
  return (amount * 1_000_000).toString();
}

export function parseUSDCAmount(amount: string): number {
  return parseInt(amount) / 1_000_000;
}

export function calculatePlatformFee(amount: number, feePercentage: number = 2.5): {
  platformFee: number;
  builderAmount: number;
  total: number;
} {
  const platformFee = (amount * feePercentage) / 100;
  const builderAmount = amount - platformFee;
  
  return {
    platformFee,
    builderAmount,
    total: amount,
  };
}
