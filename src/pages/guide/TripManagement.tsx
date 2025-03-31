
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TripManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trip Management</h1>
          <p className="text-muted-foreground">Create and manage your guided adventures</p>
        </div>
        <Button>Create New Trip</Button>
      </header>
      
      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="active" className="flex-1">Active Trips</TabsTrigger>
          <TabsTrigger value="drafts" className="flex-1">Drafts</TabsTrigger>
          <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TripCard 
              title="Yosemite Backcountry Trek" 
              location="Yosemite National Park, CA"
              duration="3 days"
              price={399}
              difficulty="Moderate"
              status="active"
              capacity={6}
              bookings={2}
              nextDate="June 15, 2023"
            />
            
            <TripCard 
              title="Mt. Rainier Summit Climb" 
              location="Mt. Rainier National Park, WA"
              duration="4 days"
              price={899}
              difficulty="Challenging"
              status="active"
              capacity={4}
              bookings={4}
              nextDate="July 10, 2023"
              isFull={true}
            />
            
            <TripCard 
              title="Olympic Peninsula Coastal Hike" 
              location="Olympic National Park, WA"
              duration="5 days"
              price={599}
              difficulty="Moderate"
              status="active"
              capacity={8}
              bookings={3}
              nextDate="August 5, 2023"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="drafts" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TripCard 
              title="Cascade Volcano Tour" 
              location="Cascade Range, OR"
              duration="7 days"
              price={1299}
              difficulty="Challenging"
              status="draft"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="archived" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TripCard 
              title="Grand Canyon Rim to River" 
              location="Grand Canyon National Park, AZ"
              duration="4 days"
              price={699}
              difficulty="Challenging"
              status="archived"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {activeTab === 'active' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upcoming Trip Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-2 text-left">Trip</th>
                      <th className="px-4 py-2 text-left">Start Date</th>
                      <th className="px-4 py-2 text-left">End Date</th>
                      <th className="px-4 py-2 text-left">Bookings</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2">Yosemite Backcountry Trek</td>
                      <td className="px-4 py-2">Jun 15, 2023</td>
                      <td className="px-4 py-2">Jun 17, 2023</td>
                      <td className="px-4 py-2">2/6</td>
                      <td className="px-4 py-2">
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Confirmed
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button className="text-blue-600 hover:underline">Manage</button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">Mt. Rainier Summit Climb</td>
                      <td className="px-4 py-2">Jul 10, 2023</td>
                      <td className="px-4 py-2">Jul 13, 2023</td>
                      <td className="px-4 py-2">4/4</td>
                      <td className="px-4 py-2">
                        <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                          Full
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button className="text-blue-600 hover:underline">Manage</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Olympic Peninsula Coastal Hike</td>
                      <td className="px-4 py-2">Aug 5, 2023</td>
                      <td className="px-4 py-2">Aug 9, 2023</td>
                      <td className="px-4 py-2">3/8</td>
                      <td className="px-4 py-2">
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Open
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button className="text-blue-600 hover:underline">Manage</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface TripCardProps {
  title: string;
  location: string;
  duration: string;
  price: number;
  difficulty: string;
  status: 'active' | 'draft' | 'archived';
  capacity?: number;
  bookings?: number;
  nextDate?: string;
  isFull?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({
  title,
  location,
  duration,
  price,
  difficulty,
  status,
  capacity,
  bookings,
  nextDate,
  isFull = false
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500">
        {/* This would be the trip image */}
        <span>Trip Image</span>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{location}</p>
        
        <div className="flex justify-between mb-3">
          <div className="text-sm">
            <span className="font-medium">${price}</span> / person
          </div>
          <div className="text-sm">{duration}</div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="text-xs px-2 py-1 bg-gray-100 rounded-full">
            {difficulty}
          </div>
          
          {status === 'draft' && (
            <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              Draft
            </div>
          )}
          
          {status === 'archived' && (
            <div className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
              Archived
            </div>
          )}
          
          {status === 'active' && isFull && (
            <div className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
              Full
            </div>
          )}
        </div>
        
        {status === 'active' && nextDate && (
          <div className="text-sm mb-3">
            <span className="text-muted-foreground">Next date:</span> {nextDate}
          </div>
        )}
        
        {status === 'active' && typeof bookings === 'number' && typeof capacity === 'number' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Bookings</span>
              <span>{bookings}/{capacity}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(bookings / capacity) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button variant="outline" size="sm">
            {status === 'draft' ? 'Edit Draft' : 'Manage'}
          </Button>
          
          {status === 'active' && (
            <Button size="sm">View Details</Button>
          )}
          
          {status === 'draft' && (
            <Button size="sm">Publish</Button>
          )}
          
          {status === 'archived' && (
            <Button size="sm" variant="outline">Restore</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TripManagement;
