import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Clock, Video } from 'lucide-react';

interface ConsultationBookingProps {
  builderId: string;
  clientId: string;
}

export function ConsultationBooking({ builderId, clientId }: ConsultationBookingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDuration, setSelectedDuration] = useState<'15' | '30' | '60'>('30');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [clientNotes, setClientNotes] = useState('');
  
  const { data: builder } = useQuery({
    queryKey: [`/api/builders/${builderId}`]
  });
  
  const { data: slots } = useQuery({
    queryKey: [`/api/calendar-slots/${builderId}`],
    enabled: !!builderId && !!selectedDate
  });
  
  const availableSlots = slots?.filter((slot: any) => {
    const slotDate = new Date(slot.startTime);
    return slotDate.toDateString() === selectedDate?.toDateString() && 
           !slot.isBooked && 
           slot.isAvailable;
  }) || [];
  
  const price = selectedDuration === '15' 
    ? builder?.consultation15minPrice
    : selectedDuration === '30'
    ? builder?.consultation30minPrice
    : builder?.consultation60minPrice;
  
  const bookConsultation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/consultations', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/calendar-slots/${builderId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/consultations`] });
      toast({
        title: 'Consultation Booked!',
        description: 'You will receive a confirmation email with the meeting link.',
      });
      setClientNotes('');
      setSelectedSlotId('');
    },
    onError: () => {
      toast({
        title: 'Booking Failed',
        description: 'Failed to book consultation. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  const handleBook = () => {
    if (!selectedSlotId) {
      toast({
        title: 'Select a Time',
        description: 'Please select an available time slot',
        variant: 'destructive'
      });
      return;
    }
    
    const slot = availableSlots.find((s: any) => s.id === selectedSlotId);
    
    bookConsultation.mutate({
      builderId,
      clientId,
      duration: parseInt(selectedDuration),
      price,
      scheduledAt: slot.startTime,
      calendarSlotId: selectedSlotId,
      timezone: 'UTC',
      clientNotes,
      status: 'scheduled'
    });
  };
  
  if (!builder?.consultationEnabled) {
    return (
      <Card data-testid="card-consultation-disabled">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            This builder does not offer consultations at this time.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card data-testid="card-consultation-booking">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Book a Consultation
        </CardTitle>
        <CardDescription>
          Schedule a 1-on-1 call with {builder?.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Select Duration</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {builder?.consultation15minPrice && (
              <Button
                variant={selectedDuration === '15' ? 'default' : 'outline'}
                onClick={() => setSelectedDuration('15')}
                className="flex flex-col h-auto py-3"
                data-testid="button-duration-15"
              >
                <Clock className="h-4 w-4 mb-1" />
                <span className="text-xs">15 min</span>
                <span className="font-bold">${builder.consultation15minPrice}</span>
              </Button>
            )}
            {builder?.consultation30minPrice && (
              <Button
                variant={selectedDuration === '30' ? 'default' : 'outline'}
                onClick={() => setSelectedDuration('30')}
                className="flex flex-col h-auto py-3"
                data-testid="button-duration-30"
              >
                <Clock className="h-4 w-4 mb-1" />
                <span className="text-xs">30 min</span>
                <span className="font-bold">${builder.consultation30minPrice}</span>
              </Button>
            )}
            {builder?.consultation60minPrice && (
              <Button
                variant={selectedDuration === '60' ? 'default' : 'outline'}
                onClick={() => setSelectedDuration('60')}
                className="flex flex-col h-auto py-3"
                data-testid="button-duration-60"
              >
                <Clock className="h-4 w-4 mb-1" />
                <span className="text-xs">60 min</span>
                <span className="font-bold">${builder.consultation60minPrice}</span>
              </Button>
            )}
          </div>
        </div>
        
        <div>
          <Label>Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="rounded-md border mt-2"
            data-testid="calendar-consultation"
          />
        </div>
        
        {selectedDate && availableSlots.length > 0 && (
          <div>
            <Label>Available Times</Label>
            <Select value={selectedSlotId} onValueChange={setSelectedSlotId}>
              <SelectTrigger data-testid="select-time-slot">
                <SelectValue placeholder="Choose a time" />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot: any) => (
                  <SelectItem key={slot.id} value={slot.id} data-testid={`option-slot-${slot.id}`}>
                    {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {selectedDate && availableSlots.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4" data-testid="text-no-slots">
            No available slots on this date. Please select another date.
          </p>
        )}
        
        <div>
          <Label htmlFor="client-notes">What would you like to discuss?</Label>
          <Textarea
            id="client-notes"
            placeholder="Brief description of what you'd like help with..."
            value={clientNotes}
            onChange={(e) => setClientNotes(e.target.value)}
            className="mt-2"
            data-testid="input-client-notes"
          />
        </div>
        
        <Button 
          onClick={handleBook}
          disabled={!selectedSlotId || bookConsultation.isPending}
          className="w-full"
          size="lg"
          data-testid="button-book-consultation"
        >
          {bookConsultation.isPending ? 'Booking...' : `Book Consultation - $${price}`}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          After booking, you'll receive a confirmation email with a video call link. 
          The consultation fee can be applied as credit toward any order with this builder.
        </p>
      </CardContent>
    </Card>
  );
}
