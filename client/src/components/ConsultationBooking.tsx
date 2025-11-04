import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Clock, Video, CheckCircle2, Sparkles, Calendar as CalendarIcon, MessageSquare, CreditCard, ArrowRight, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsultationBookingProps {
  builderId: string;
  clientId: string;
}

type Duration = '15' | '30' | '60';

export function ConsultationBooking({ builderId, clientId }: ConsultationBookingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDuration, setSelectedDuration] = useState<Duration>('30');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [clientNotes, setClientNotes] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  const { data: builder, isLoading: builderLoading } = useQuery({
    queryKey: [`/api/builders/${builderId}`]
  });
  
  const { data: slots, isLoading: slotsLoading } = useQuery({
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
        title: '🎉 Consultation Booked!',
        description: "You'll receive a confirmation email with the meeting link",
      });
      setStep(1);
      setClientNotes('');
      setSelectedSlotId('');
      setSelectedDate(undefined);
    },
    onError: () => {
      toast({
        title: 'Booking Failed',
        description: 'Unable to book consultation. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  const handleBook = () => {
    if (!selectedSlotId) {
      toast({
        title: 'Select a Time',
        description: 'Please choose an available time slot',
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
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      clientNotes,
      status: 'scheduled'
    });
  };
  
  if (builderLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading consultation options...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!builder?.consultationEnabled) {
    return (
      <Card data-testid="card-consultation-disabled" className="border-dashed">
        <CardContent className="py-12">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <XCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Consultations Not Available</h3>
              <p className="text-sm text-muted-foreground">
                This builder doesn't offer consultations at this time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const canProceedToStep2 = selectedDuration && selectedDate;
  const canProceedToStep3 = canProceedToStep2 && selectedSlotId;
  
  return (
    <Card className="overflow-hidden" data-testid="card-consultation-booking">
      <CardHeader className="bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Video className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">Book a Consultation</CardTitle>
            <CardDescription>
              1-on-1 video call with {builder?.name}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-white">
            Step {step} of 3
          </Badge>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`h-1.5 w-full rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Duration */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <Label className="text-base font-medium mb-3 block">Choose Duration</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {builder?.consultation15minPrice && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDuration('15')}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedDuration === '15' 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover-elevate'
                      }`}
                      data-testid="button-duration-15"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="h-5 w-5 text-primary" />
                        {selectedDuration === '15' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="font-semibold mb-1">Quick Chat</div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        ${builder.consultation15minPrice}
                      </div>
                      <div className="text-sm text-muted-foreground">15 minutes</div>
                    </motion.button>
                  )}
                  
                  {builder?.consultation30minPrice && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDuration('30')}
                      className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                        selectedDuration === '30' 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover-elevate'
                      }`}
                      data-testid="button-duration-30"
                    >
                      <Badge className="absolute top-2 right-2 text-xs">Popular</Badge>
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="h-5 w-5 text-primary" />
                        {selectedDuration === '30' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="font-semibold mb-1">Strategy Session</div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        ${builder.consultation30minPrice}
                      </div>
                      <div className="text-sm text-muted-foreground">30 minutes</div>
                    </motion.button>
                  )}
                  
                  {builder?.consultation60minPrice && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDuration('60')}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedDuration === '60' 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover-elevate'
                      }`}
                      data-testid="button-duration-60"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="h-5 w-5 text-primary" />
                        {selectedDuration === '60' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="font-semibold mb-1">Deep Dive</div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        ${builder.consultation60minPrice}
                      </div>
                      <div className="text-sm text-muted-foreground">60 minutes</div>
                    </motion.button>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-base font-medium mb-3 block flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Select Date
                </Label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border shadow-sm"
                    data-testid="calendar-consultation"
                  />
                </div>
              </div>
              
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className="w-full h-12"
                size="lg"
                data-testid="button-next-step-2"
              >
                Continue to Time Selection
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}
          
          {/* Step 2: Time Slot */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Selected</div>
                  <div className="font-medium">
                    {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-sm text-primary">{selectedDuration} minute session • ${price}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                  Change
                </Button>
              </div>
              
              <div>
                <Label className="text-base font-medium mb-3 block flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Available Times
                </Label>
                
                {slotsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availableSlots.map((slot: any) => {
                      const time = new Date(slot.startTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      });
                      return (
                        <motion.button
                          key={slot.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedSlotId === slot.id
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover-elevate'
                          }`}
                          data-testid={`option-slot-${slot.id}`}
                        >
                          {time}
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg" data-testid="text-no-slots">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No available slots on this date
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="mt-2">
                      Choose Different Date
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  className="flex-1"
                  data-testid="button-next-step-3"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Confirm & Pay */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Summary */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-purple-700 font-medium">
                    <Sparkles className="h-4 w-4" />
                    Consultation Summary
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{selectedDuration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">
                        {availableSlots.find((s: any) => s.id === selectedSlotId) && 
                          new Date(availableSlots.find((s: any) => s.id === selectedSlotId).startTime)
                            .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-primary text-lg">${price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Notes */}
              <div>
                <Label htmlFor="client-notes" className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  What would you like to discuss?
                </Label>
                <Textarea
                  id="client-notes"
                  placeholder="Brief overview of your project, questions, or topics you'd like to cover..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="min-h-[100px] resize-none"
                  data-testid="input-client-notes"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  This helps the builder prepare for your call
                </p>
              </div>
              
              {/* Value Prop */}
              <Card className="bg-cyan-50 border-cyan-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-cyan-900">💰 This fee becomes order credit</p>
                      <p className="text-cyan-700">
                        If you decide to work with {builder?.name}, your ${price} consultation fee 
                        will be credited toward your first order!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleBook}
                  disabled={bookConsultation.isPending}
                  className="flex-1 h-12"
                  size="lg"
                  data-testid="button-book-consultation"
                >
                  {bookConsultation.isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirm & Pay ${price}
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                You'll receive a confirmation email with the video call link within minutes
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
