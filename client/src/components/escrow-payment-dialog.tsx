import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { BrowserProvider } from "ethers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Wallet,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import {
  getUSDCContract,
  approveUSDC,
  createEscrowOnChain,
  checkUSDCAllowance,
  usdcToWei,
  weiToUsdc,
  USDC_ADDRESSES,
  waitForTransaction,
} from "@/lib/escrowContract";

interface EscrowPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  builderAddress: string;
  totalAmount: number;
  milestones: Array<{
    description: string;
    amount: number;
    deadlineDays: number;
  }>;
  onSuccess: (txHash: string) => void;
  onError: (error: string) => void;
}

enum PaymentStep {
  INITIAL = "initial",
  CHECK_BALANCE = "check_balance",
  APPROVE_USDC = "approve_usdc",
  CREATE_ESCROW = "create_escrow",
  COMPLETE = "complete",
  ERROR = "error",
}

export function EscrowPaymentDialog({
  open,
  onOpenChange,
  orderId,
  builderAddress,
  totalAmount,
  milestones,
  onSuccess,
  onError,
}: EscrowPaymentDialogProps) {
  const { address, isConnected, connector } = useAccount();
  const { toast } = useToast();

  const [step, setStep] = useState<PaymentStep>(PaymentStep.INITIAL);
  const [usdcBalance, setUsdcBalance] = useState<bigint>(BigInt(0));
  const [currentAllowance, setCurrentAllowance] = useState<bigint>(BigInt(0));
  const [txHash, setTxHash] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmountWei = usdcToWei(totalAmount);
  const hasEnoughBalance = usdcBalance >= totalAmountWei;
  const hasEnoughAllowance = currentAllowance >= totalAmountWei;

  // Check USDC balance and allowance
  useEffect(() => {
    if (!open || !address || !isConnected) return;

    const checkBalanceAndAllowance = async () => {
      try {
        setStep(PaymentStep.CHECK_BALANCE);
        const walletClient = await connector?.getProvider();
        if (!walletClient) throw new Error("Wallet provider not available");

        const provider = new BrowserProvider(walletClient as any);
        const signer = await provider.getSigner();

        // Get USDC balance
        const usdcContract = await getUSDCContract(provider, signer);
        const balance = await usdcContract.balanceOf(address);
        setUsdcBalance(balance as bigint);

        // Get current allowance
        const allowance = await checkUSDCAllowance(provider, address);
        setCurrentAllowance(allowance);

        // Determine next step
        if (balance < totalAmountWei) {
          setStep(PaymentStep.ERROR);
          setErrorMessage(`Insufficient USDC balance. You have $${weiToUsdc(balance).toFixed(2)}, need $${totalAmount.toFixed(2)}`);
        } else if (allowance < totalAmountWei) {
          setStep(PaymentStep.APPROVE_USDC);
        } else {
          setStep(PaymentStep.CREATE_ESCROW);
        }
      } catch (error: any) {
        console.error("Error checking balance:", error);
        setStep(PaymentStep.ERROR);
        setErrorMessage(error.message || "Failed to check USDC balance");
      }
    };

    checkBalanceAndAllowance();
  }, [open, address, isConnected, connector, totalAmountWei, totalAmount]);

  const handleApproveUSDC = async () => {
    if (!address || !isConnected) return;

    try {
      setIsProcessing(true);
      const walletClient = await connector?.getProvider();
      if (!walletClient) throw new Error("Wallet provider not available");

      const provider = new BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();

      toast({
        title: "Approve USDC",
        description: "Please confirm the transaction in your wallet...",
      });

      // Approve USDC spending
      const tx = await approveUSDC(signer, totalAmountWei);
      
      toast({
        title: "Transaction Submitted",
        description: "Waiting for confirmation...",
      });

      const receipt = await waitForTransaction(tx, 1);
      setTxHash(receipt.hash);

      toast({
        title: "USDC Approved",
        description: "You can now create the escrow",
      });

      // Update allowance and move to next step
      setCurrentAllowance(totalAmountWei);
      setStep(PaymentStep.CREATE_ESCROW);
    } catch (error: any) {
      console.error("Error approving USDC:", error);
      const message = error.message || "Failed to approve USDC";
      setErrorMessage(message);
      setStep(PaymentStep.ERROR);
      onError(message);
      
      toast({
        title: "Approval Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateEscrow = async () => {
    if (!address || !isConnected) return;

    try {
      setIsProcessing(true);
      const walletClient = await connector?.getProvider();
      if (!walletClient) throw new Error("Wallet provider not available");

      const provider = new BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      // Prepare milestone data
      const milestoneAmounts = milestones.map(m => usdcToWei(m.amount));
      const milestoneDescriptions = milestones.map(m => m.description);
      const currentTime = Math.floor(Date.now() / 1000);
      const milestoneDeadlines = milestones.map(m => currentTime + (m.deadlineDays * 86400));

      toast({
        title: "Create Escrow",
        description: "Please confirm the transaction in your wallet...",
      });

      // Create escrow on-chain
      const tx = await createEscrowOnChain(
        signer,
        orderId,
        builderAddress,
        totalAmountWei,
        milestoneAmounts,
        milestoneDescriptions,
        milestoneDeadlines
      );

      toast({
        title: "Transaction Submitted",
        description: "Creating escrow contract...",
      });

      const receipt = await waitForTransaction(tx, 1);
      setTxHash(receipt.hash);
      setStep(PaymentStep.COMPLETE);

      // Get block explorer URL
      const isMainnet = Number(network.chainId) === 8453;
      const explorerUrl = isMainnet
        ? `https://basescan.org/tx/${receipt.hash}`
        : `https://sepolia.basescan.org/tx/${receipt.hash}`;

      toast({
        title: "Escrow Created Successfully",
        description: (
          <div className="flex items-center gap-2">
            <span>Your funds are now secured on-chain</span>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline flex items-center gap-1"
            >
              View <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ),
      });

      onSuccess(receipt.hash);
    } catch (error: any) {
      console.error("Error creating escrow:", error);
      const message = error.message || "Failed to create escrow";
      setErrorMessage(message);
      setStep(PaymentStep.ERROR);
      onError(message);
      
      toast({
        title: "Escrow Creation Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepProgress = () => {
    switch (step) {
      case PaymentStep.INITIAL:
      case PaymentStep.CHECK_BALANCE:
        return 20;
      case PaymentStep.APPROVE_USDC:
        return hasEnoughAllowance ? 80 : 40;
      case PaymentStep.CREATE_ESCROW:
        return 60;
      case PaymentStep.COMPLETE:
        return 100;
      default:
        return 0;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case PaymentStep.CHECK_BALANCE:
        return "Checking USDC Balance...";
      case PaymentStep.APPROVE_USDC:
        return hasEnoughAllowance ? "USDC Approved" : "Approve USDC Spending";
      case PaymentStep.CREATE_ESCROW:
        return "Create Escrow Contract";
      case PaymentStep.COMPLETE:
        return "Payment Complete";
      case PaymentStep.ERROR:
        return "Payment Failed";
      default:
        return "Secure Payment";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription>
            Secure your payment with blockchain escrow protection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={getStepProgress()} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Step {step === PaymentStep.APPROVE_USDC ? "1" : step === PaymentStep.CREATE_ESCROW ? "2" : "3"} of 3
            </p>
          </div>

          <Separator />

          {/* Payment Summary */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Payment</span>
                <span className="text-xl font-bold">${totalAmount.toFixed(2)} USDC</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your Balance</span>
                <span className={hasEnoughBalance ? "text-chart-3 font-medium" : "text-destructive font-medium"}>
                  ${weiToUsdc(usdcBalance).toFixed(2)} USDC
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Milestones</span>
                <span className="font-medium">{milestones.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Step-specific content */}
          {step === PaymentStep.CHECK_BALANCE && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Checking your USDC balance...</AlertDescription>
            </Alert>
          )}

          {step === PaymentStep.APPROVE_USDC && !hasEnoughAllowance && (
            <Alert className="border-primary/40 bg-primary/10">
              <Wallet className="h-4 w-4 text-primary" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Approve USDC Spending</p>
                  <p className="text-sm">
                    Allow the escrow contract to securely hold ${totalAmount.toFixed(2)} USDC. This is a one-time approval.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {step === PaymentStep.CREATE_ESCROW && (
            <Alert className="border-chart-3/40 bg-chart-3/10">
              <CheckCircle2 className="h-4 w-4 text-chart-3" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium text-chart-3">Ready to Create Escrow</p>
                  <p className="text-sm">
                    Your USDC will be locked in a smart contract and released milestone-by-milestone as work is completed.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {step === PaymentStep.COMPLETE && (
            <Alert className="border-chart-3/40 bg-chart-3/10">
              <CheckCircle2 className="h-4 w-4 text-chart-3" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium text-chart-3">Escrow Created Successfully</p>
                  <p className="text-sm">
                    Your payment is now secured on the blockchain. The builder will receive funds as milestones are completed.
                  </p>
                  {txHash && (
                    <a
                      href={`https://sepolia.basescan.org/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                      data-testid="link-view-transaction"
                    >
                      View on BaseScan <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {step === PaymentStep.ERROR && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Payment Failed</p>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Milestones Preview */}
          {milestones.length > 0 && step !== PaymentStep.ERROR && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Milestone Breakdown</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm"
                  >
                    <span className="text-muted-foreground flex-1 truncate">
                      {milestone.description}
                    </span>
                    <span className="font-medium ml-2">${milestone.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isProcessing || step === PaymentStep.CHECK_BALANCE}
              data-testid="button-cancel-payment"
            >
              {step === PaymentStep.COMPLETE ? "Close" : "Cancel"}
            </Button>

            {step === PaymentStep.APPROVE_USDC && !hasEnoughAllowance && (
              <Button
                onClick={handleApproveUSDC}
                className="flex-1"
                disabled={isProcessing || !hasEnoughBalance}
                data-testid="button-approve-usdc"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    Approve USDC
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}

            {step === PaymentStep.CREATE_ESCROW && (
              <Button
                onClick={handleCreateEscrow}
                className="flex-1"
                disabled={isProcessing}
                data-testid="button-create-escrow"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Escrow...
                  </>
                ) : (
                  <>
                    Create Escrow
                    <ShieldCheck className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}

            {step === PaymentStep.ERROR && errorMessage.includes("Insufficient") && (
              <Button
                onClick={() => window.open("https://app.uniswap.org", "_blank")}
                className="flex-1"
                variant="default"
                data-testid="button-get-usdc"
              >
                Get USDC <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Security Note */}
          <p className="text-xs text-muted-foreground text-center">
            Your funds are protected by smart contract escrow. Payments are only released when you approve completed milestones.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
