
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Campground, getCampgroundDetails } from '@/services/campground/campgroundService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';

const CampgroundBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [campground, setCampground] = useState<Campground | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 1 week from now
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // Default to 10 days from now (3 day stay)
  );
  const [numGuests, setNumGuests] = useState(2);
  
  useEffect(() => {
    if (!id) {
      setError("Campground ID is missing");
      setLoading(false);
      return;
    }
    
    const fetchCampground = async () => {
      try {
        setLoading(true);
        const campgroundData = await getCampgroundDetails(id);
        setCampground(campgroundData);
      } catch (err) {
        console.error("Error fetching campground:", err);
        setError(err instanceof Error ? err.message : "Failed to load campground details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampground();
  }, [id]);
  
  const handleBookNow = () => {
    if (!campground || !startDate || !endDate) return;
    
    // This would integrate with actual booking functionality later
    toast({
      title: "Booking Successful!",
      description: `Your stay at ${campground.name} has been booked from ${format(startDate, 'PPP')} to ${format(endDate, 'PPP')} for ${numGuests} guests.`,
    });
    
    // Navigate back to trips
    setTimeout(() => {
      navigate("/trip");
    }, 2000);
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading campground details..." />;
  }
  
  if (error) {
    return (
      <ErrorDisplay 
        errorMessage={error}
        onRetry={() => navigate(-1)}
        onReturn={() => navigate("/trip")}
      />
    );
  }
  
  if (!campground) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Campground Not Found</h2>
          <p className="mb-6">The campground you're looking for couldn't be found.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  // Calculate number of nights
  const nights = startDate && endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  // Calculate total price
  const pricePerNight = campground.price?.min || 0;
  const totalPrice = pricePerNight * nights;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-4">{campground.name}</h1>
              
              {campground.images && campground.images.length > 0 && (
                <div className="rounded-md overflow-hidden mb-6">
                  <img 
                    src={campground.images[0]}
                    alt={campground.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">About this campground</h2>
                <p className="text-gray-700">{campground.description}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dates" className="text-base font-medium">Dates</Label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <div>
                      <Label htmlFor="check-in">Check In</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal mt-1"
                            id="check-in"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label htmlFor="check-out">Check Out</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal mt-1"
                            id="check-out"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            disabled={(date) => 
                              date < new Date() || 
                              (startDate ? date <= startDate : false)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="guests" className="text-base font-medium">Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="10"
                    value={numGuests}
                    onChange={(e) => setNumGuests(parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Campsite</span>
                  <span className="font-medium">{campground.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Dates</span>
                  <span className="font-medium">
                    {startDate && endDate
                      ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`
                      : 'Select dates'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Nights</span>
                  <span className="font-medium">{nights}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Guests</span>
                  <span className="font-medium">{numGuests}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span>Price per night</span>
                  <span className="font-medium">${pricePerNight.toFixed(2)}</span>
                </div>
                
                {nights > 0 && (
                  <div className="flex justify-between">
                    <span>{nights} nights</span>
                    <span className="font-medium">${(pricePerNight * nights).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Booking fee</span>
                  <span className="font-medium">$25.00</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${(totalPrice + 25).toFixed(2)}</span>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  You won't be charged yet. Payment will be collected when your booking is confirmed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampgroundBooking;
