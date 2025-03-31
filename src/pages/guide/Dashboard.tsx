
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

const GuideDashboard: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">Guide Dashboard</h1>
        <p className="text-muted-foreground">Manage your trips and recommendations</p>
      </header>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start mb-4 overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trips">My Trips</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">2 upcoming this week</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">3 new inquiries</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm text-muted-foreground">Based on 23 reviews</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">New booking: Yosemite Weekend Trek</p>
                    <p className="text-sm text-muted-foreground">From John Doe · 2 people · June 15-17</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </li>
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">New review: Mt. Rainier Expedition</p>
                    <p className="text-sm text-muted-foreground">From Sarah Miller · 5 stars</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Yesterday</span>
                </li>
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Trip completed: Sequoia National Park</p>
                    <p className="text-sm text-muted-foreground">4 guests · 3 days</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2 days ago</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Trip Offerings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Manage your available guided trips and create new experiences</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Trip cards would go here */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-bold">Yosemite Weekend Trek</h3>
                  <p className="text-sm mb-2">3 days · Moderate · Up to 6 people</p>
                  <p className="text-sm text-muted-foreground mb-2">Next available: June 15</p>
                  <div className="flex justify-between">
                    <span className="font-medium">$299/person</span>
                    <button className="text-sm text-blue-600">Edit</button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-bold">Mt. Rainier Expedition</h3>
                  <p className="text-sm mb-2">5 days · Challenging · Up to 4 people</p>
                  <p className="text-sm text-muted-foreground mb-2">Next available: July 10</p>
                  <div className="flex justify-between">
                    <span className="font-medium">$599/person</span>
                    <button className="text-sm text-blue-600">Edit</button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You have 5 upcoming trips with 12 total guests</p>
              {/* Booking information would go here */}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Overall rating: 4.8/5 from 23 reviews</p>
              {/* Reviews would go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuideDashboard;
