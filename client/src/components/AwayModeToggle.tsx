import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Moon, CheckCircle2, XCircle, Calendar, MessageSquare, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AwayModeToggleProps {
  builderId: string;
}

export function AwayModeToggle({ builderId }: AwayModeToggleProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: builder, isLoading } = useQuery({
    queryKey: [`/api/builders/${builderId}`]
  });
  
  const [isAway, setIsAway] = useState(builder?.isAway || false);
  const [awayMessage, setAwayMessage] = useState(builder?.awayMessage || '');
  const [awayUntil, setAwayUntil] = useState(builder?.awayUntil?.split('T')[0] || '');
  const [showPreview, setShowPreview] = useState(false);
  
  const updateAwayMode = useMutation({
    mutationFn: async (data: { isAway: boolean; awayMessage?: string; awayUntil?: string }) => {
      return await apiRequest('PUT', `/api/builders/${builderId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/builders/${builderId}`] });
      toast({
        title: isAway ? 'Away Mode Activated' : 'Welcome Back!',
        description: isAway 
          ? 'Your services are now paused and hidden from search' 
          : 'Your services are live and visible to clients',
      });
    },
    onError: () => {
      toast({
        title: 'Update Failed',
        description: 'Could not update away mode. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  const handleToggle = () => {
    if (!isAway) {
      setIsAway(true);
    } else {
      setIsAway(false);
      updateAwayMode.mutate({
        isAway: false,
        awayMessage: '',
        awayUntil: ''
      });
    }
  };
  
  const handleSave = () => {
    if (isAway && !awayMessage.trim()) {
      toast({
        title: 'Message Required',
        description: 'Please provide an away message for your clients',
        variant: 'destructive'
      });
      return;
    }
    
    updateAwayMode.mutate({
      isAway,
      awayMessage: isAway ? awayMessage : '',
      awayUntil: isAway ? (awayUntil ? new Date(awayUntil).toISOString() : '') : ''
    });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getReturnDateDisplay = () => {
    if (!awayUntil) return null;
    const date = new Date(awayUntil);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Returns today';
    if (diffDays === 1) return 'Returns tomorrow';
    return `Returns in ${diffDays} days`;
  };
  
  return (
    <Card className="overflow-hidden" data-testid="card-away-mode">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-cyan-50 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Moon className={`h-5 w-5 transition-all ${isAway ? 'text-purple-600' : 'text-muted-foreground'}`} />
              Away Mode
            </CardTitle>
            <CardDescription className="mt-1.5">
              Take a break while keeping your reputation intact
            </CardDescription>
          </div>
          <Badge 
            variant={isAway ? 'default' : 'secondary'} 
            className="ml-4 transition-all"
            data-testid="badge-status"
          >
            {isAway ? (
              <>
                <Moon className="h-3 w-3 mr-1" />
                Away
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Available
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Status Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full transition-all ${isAway ? 'bg-purple-100' : 'bg-green-100'}`}>
              {isAway ? (
                <Moon className="h-5 w-5 text-purple-600" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
            </div>
            <div>
              <Label className="text-base font-medium" data-testid="label-away-status">
                {isAway ? 'Currently Away' : 'Currently Available'}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isAway ? 'Services paused and hidden' : 'Accepting new orders'}
              </p>
            </div>
          </div>
          <Switch 
            checked={isAway}
            onCheckedChange={handleToggle}
            data-testid="switch-away-mode"
            className="data-[state=checked]:bg-purple-600"
          />
        </div>
        
        <AnimatePresence>
          {isAway && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Away Message */}
              <div className="space-y-2">
                <Label htmlFor="away-message" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Away Message
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="away-message"
                  placeholder="e.g., 'Taking a short break to recharge. I'll be back on December 15th and ready to take on new projects!'"
                  value={awayMessage}
                  onChange={(e) => setAwayMessage(e.target.value)}
                  className="min-h-[100px] resize-none"
                  data-testid="input-away-message"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    This appears on your profile and services
                  </span>
                  <span className={awayMessage.length > 200 ? 'text-destructive' : 'text-muted-foreground'}>
                    {awayMessage.length}/200
                  </span>
                </div>
              </div>
              
              {/* Return Date */}
              <div className="space-y-2">
                <Label htmlFor="away-until" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Expected Return Date
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </Label>
                <Input
                  id="away-until"
                  type="date"
                  value={awayUntil}
                  onChange={(e) => setAwayUntil(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  data-testid="input-away-until"
                />
                {awayUntil && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    {getReturnDateDisplay()}
                  </p>
                )}
              </div>
              
              {/* Preview Toggle */}
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  {showPreview ? <Eye className="h-4 w-4 text-purple-600" /> : <EyeOff className="h-4 w-4 text-purple-600" />}
                  <span className="text-sm font-medium">Preview how clients see this</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  data-testid="button-preview-toggle"
                >
                  {showPreview ? 'Hide' : 'Show'}
                </Button>
              </div>
              
              {/* Preview */}
              <AnimatePresence>
                {showPreview && awayMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert className="border-purple-200 bg-purple-50/50">
                      <Moon className="h-4 w-4 text-purple-600" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Away</Badge>
                            {awayUntil && (
                              <span className="text-xs text-muted-foreground">
                                {getReturnDateDisplay()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm">{awayMessage}</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Save Button */}
              <Button 
                onClick={handleSave}
                disabled={updateAwayMode.isPending || !awayMessage.trim()}
                className="w-full h-12"
                size="lg"
                data-testid="button-save-away-mode"
              >
                {updateAwayMode.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Activating Away Mode...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Activate Away Mode
                  </>
                )}
              </Button>
              
              {/* Info Box */}
              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  What happens when you're away:
                </h4>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                    <span>All services hidden from marketplace search</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                    <span>Profile shows "Away" badge and your message</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>Active orders continue normally (not affected)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>You can still receive and reply to messages</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>Delivery dates on active orders auto-extended</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
