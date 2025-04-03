
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ItineraryDay } from '@/types/trips';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CalendarDays, Clock, MapPin } from 'lucide-react';

interface TripItineraryProps {
  itinerary: ItineraryDay[];
}

const TripItinerary: React.FC<TripItineraryProps> = ({
  itinerary
}) => {
  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="px-6 py-4 bg-purple-50 border-t border-purple-100">
        <p className="text-center text-gray-800 font-medium">No itinerary information available</p>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-gray-50 border-t border-gray-200">
      <div className="px-6 py-4">
        <Accordion type="multiple" className="space-y-6">
          {itinerary.map((day, idx) => (
            <AccordionItem 
              key={idx} 
              value={`day-${day.day}`} 
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline bg-white group">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-800">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-lg text-gray-900">
                      Day {day.day} - {day.title || 'Activities'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {day.description}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-5 pb-5 pt-0">
                <div className="pl-[52px]"> {/* Align with the icon */}
                  <div className="mb-4">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 mb-2">
                      <Clock className="h-3 w-3 mr-1" /> Full day
                    </Badge>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                      <p className="text-sm text-gray-700">{day.description}</p>
                    </div>
                  </div>
                  
                  {day.activities && day.activities.length > 0 ? (
                    <div className="space-y-5 mt-6">
                      <h3 className="font-medium text-lg text-gray-900">Activities</h3>
                      {day.activities.map((activity, actIdx) => (
                        <div 
                          key={actIdx} 
                          className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-purple-900">
                              {activity.name || 'Unnamed Activity'}
                            </h4>
                            {activity.duration && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.duration}
                              </Badge>
                            )}
                          </div>
                          
                          {activity.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              {activity.description}
                            </p>
                          )}
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            {activity.type && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-800">
                                {activity.type}
                              </Badge>
                            )}
                            
                            {activity.permitRequired && (
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 font-medium">
                                Permit Required
                              </Badge>
                            )}
                          </div>
                          
                          {activity.permitDetails && (
                            <div className="mt-3 text-sm">
                              <span className="font-medium">Permit Details: </span>
                              <span className="text-gray-600">{activity.permitDetails}</span>
                            </div>
                          )}
                          
                          {activity.outfitters && activity.outfitters.length > 0 && (
                            <div className="mt-3 text-sm">
                              <span className="font-medium">Suggested Outfitters: </span>
                              <span className="text-gray-600">{activity.outfitters.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 text-center p-4 bg-gray-50 rounded-md">
                      <p className="text-gray-500">No activities listed for this day</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default TripItinerary;
