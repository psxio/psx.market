import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AwayModeToggleProps {
  builderId: string;
}

export function AwayModeToggle({ builderId }: AwayModeToggleProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: builder } = useQuery({
    queryKey: [`/api/builders/${builderId}`]
  });
  
  const [isAway, setIsAway] = useState(builder?.isAway || false);
  const [awayMessage, setAwayMessage] = useState(builder?.awayMessage || '');
  const [awayUntil, setAwayUntil] = useState(builder?.awayUntil?.split('T')[0] || '');
  
  const updateAwayMode = useMutation({
    mutationFn: async (data: { isAway: boolean; awayMessage?: string; awayUntil?: string }) => {
      return await apiRequest('PUT', `/api/builders/${builderId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/builders/${builderId}`] });
      toast({
        title: isAway ? 'Away Mode Disabled' : 'Away Mode Enabled',
        description: isAway 
          ? 'Your services are now visible and accepting orders' 
          : 'Your services are now hidden and paused',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update away mode',
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
    if (isAway && !awayMessage) {
      toast({
        title: 'Message Required',
        description: 'Please provide a message for your clients',
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
  
  return (
    <Card data-testid="card-away-mode">
      <CardHeader>
        <CardTitle>Away Mode</CardTitle>
        <CardDescription>
          Pause all services, hide from search, and notify clients of your absence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isAway}
            onCheckedChange={handleToggle}
            data-testid="switch-away-mode"
          />
          <Label data-testid="label-away-status">
            {isAway ? 'Away (Services Paused)' : 'Available'}
          </Label>
        </div>
        
        {isAway && (
          <div className="space-y-4 mt-4 pt-4 border-t">
            <div>
              <Label htmlFor="away-message">Away Message *</Label>
              <Textarea
                id="away-message"
                placeholder="e.g., 'On vacation until Dec 15. Will respond to messages after my return.'"
                value={awayMessage}
                onChange={(e) => setAwayMessage(e.target.value)}
                className="mt-1"
                data-testid="input-away-message"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This message will be shown to clients viewing your profile
              </p>
            </div>
            
            <div>
              <Label htmlFor="away-until">Return Date (Optional)</Label>
              <Input
                id="away-until"
                type="date"
                value={awayUntil}
                onChange={(e) => setAwayUntil(e.target.value)}
                className="mt-1"
                min={new Date().toISOString().split('T')[0]}
                data-testid="input-away-until"
              />
              <p className="text-sm text-muted-foreground mt-1">
                When do you plan to return?
              </p>
            </div>
            
            <Button 
              onClick={handleSave}
              disabled={updateAwayMode.isPending}
              className="w-full"
              data-testid="button-save-away-mode"
            >
              {updateAwayMode.isPending ? 'Saving...' : 'Save Away Mode'}
            </Button>
            
            <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t">
              <p className="font-medium">What happens when Away Mode is on:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>All your services are hidden from search results</li>
                <li>Your profile shows the away message</li>
                <li>Active orders are not affected (continue as normal)</li>
                <li>You can still receive and respond to messages</li>
                <li>Delivery dates on active orders are automatically extended</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
