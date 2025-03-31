import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ItineraryDay } from '@/types/trips';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
interface TripItineraryProps {
  itinerary: ItineraryDay[];
}
const TripItinerary: React.FC<TripItineraryProps> = ({
  itinerary
}) => {
  if (!itinerary || itinerary.length === 0) {
    return <div className="px-6 py-4 bg-purple-50 border-t border-purple-100">
        <p className="text-center text-gray-800 font-patano">No itinerary information available</p>
      </div>;
  }
  return <div className="w-full bg-purple-50 border-t border-purple-100">
      <div className="px-6 py-4 bg-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-zinc-700">Itinerary</h3>
        
        <Accordion type="multiple" className="space-y-4">
          {itinerary.map((day, idx) => <AccordionItem key={idx} value={`day-${day.day}`} className="bg-white rounded-lg shadow-sm overflow-hidden border-none">
              <AccordionTrigger className="px-4 py-3 hover:no-underline bg-[525252] bg-gray-50">
                <div className="flex flex-col items-start text-left">
                  <div className="font-semibold text-md text-[#525252]">
                    Day {day.day}: {day.title || 'Activities'}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-3">
                    {day.description && day.description.length > 100 ? day.description.substring(0, 100) + '...' : day.description}
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 pb-4 pt-0">
                {day.description && day.description.length > 100 && <p className="text-base text-gray-800 font-patano mb-4">{day.description}</p>}
                
                <div className="space-y-4">
                  {day.activities && day.activities.length > 0 ? day.activities.map((activity, actIdx) => <div key={actIdx} className="p-3 shadow-sm border-l-4 border-[#9870FF] rounded-md bg-zinc-50">
                        <div className="flex justify-between">
                          <h5 className="font-semibold text-gray-800">{activity.name || 'Unnamed Activity'}</h5>
                          {activity.duration && <span className="text-gray-800 font-patano">{activity.duration}</span>}
                        </div>
                        
                        {activity.description && <p className="text-sm text-gray-600 line-clamp-3">{activity.description}</p>}
                        
                        <div className="mt-2 flex flex-wrap gap-1">
                          {activity.type && <Badge variant="outline" className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              {activity.type}
                            </Badge>}
                          
                          {activity.permitRequired && <Badge variant="outline" className="bg-amber-100 text-gray-800">
                              Permit Required
                            </Badge>}
                        </div>
                        
                        {activity.outfitters && activity.outfitters.length > 0 && <div className="mt-2">
                            <span className="text-base font-medium text-gray-800">Suggested Outfitters: </span>
                            <span className="text-base text-gray-800 font-patano">
                              {activity.outfitters.join(', ')}
                            </span>
                          </div>}
                      </div>) : <p className="text-base text-gray-800 font-patano text-center">No activities listed for this day</p>}
                </div>
              </AccordionContent>
            </AccordionItem>)}
        </Accordion>
      </div>
    </div>;
};
export default TripItinerary;