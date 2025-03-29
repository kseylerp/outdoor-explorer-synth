
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TripDetailsComponent from '@/components/TripDetails';
import { Trip } from '@/types/trips';
import { toast } from '@/hooks/use-toast';

// A mock function to fetch a trip by ID
// In a real app, this would fetch from an API or database
const fetchTripById = (id: string): Promise<Trip | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, return mock data
      // This would be replaced with real API calls in production
      const mockTrips = [
        {
          id: '1',
          title: "Weekend Wilderness Escape: Tahoe's Hidden Trails",
          description: "Experience the breathtaking beauty of Lake Tahoe's lesser-known trails on this 3-day adventure through alpine meadows and pristine forests.",
          whyWeChoseThis: "This trip offers the perfect balance of accessibility and seclusion, with stunning views and moderate trails suitable for most hikers seeking a genuine wilderness experience without extreme difficulty.",
          difficultyLevel: 'Moderate',
          priceEstimate: '$350-450 per person',
          duration: '3 days',
          location: 'Lake Tahoe, California',
          suggestedGuides: ['Sierra Mountain Guides', 'Tahoe Adventure Company'],
          mapCenter: { lng: -120.0324, lat: 39.0968 },
          markers: [
            { 
              name: 'Emerald Bay Trailhead', 
              coordinates: { lng: -120.1037, lat: 38.9550 },
              description: 'Starting point for Day 1 hike'
            },
            { 
              name: 'Eagle Falls', 
              coordinates: { lng: -120.0994, lat: 38.9534 },
              description: 'Spectacular waterfall viewpoint'
            },
            { 
              name: 'Granite Lake', 
              coordinates: { lng: -120.1156, lat: 38.9391 },
              description: 'Pristine alpine lake for lunch stop'
            },
            { 
              name: 'Mt. Tallac Trailhead', 
              coordinates: { lng: -120.0762, lat: 38.9356 },
              description: 'Starting point for Day 2 hike'
            },
            { 
              name: 'Fallen Leaf Lake', 
              coordinates: { lng: -120.0596, lat: 38.8916 },
              description: 'Beautiful lake for kayaking on Day 3'
            }
          ],
          journey: {
            segments: [
              {
                mode: 'driving',
                from: 'South Lake Tahoe',
                to: 'Emerald Bay Trailhead',
                distance: 15000,
                duration: 1200,
                geometry: {
                  coordinates: [
                    [-120.0324, 39.0968],
                    [-120.0724, 39.0768],
                    [-120.1037, 38.9550]
                  ]
                },
                steps: [
                  {
                    maneuver: {
                      instruction: 'Drive to Emerald Bay Trailhead',
                      location: [-120.0324, 39.0968]
                    },
                    distance: 15000,
                    duration: 1200
                  }
                ]
              },
              {
                mode: 'walking',
                from: 'Emerald Bay Trailhead',
                to: 'Eagle Falls',
                distance: 2500,
                duration: 3600,
                geometry: {
                  coordinates: [
                    [-120.1037, 38.9550],
                    [-120.1015, 38.9545],
                    [-120.0994, 38.9534]
                  ]
                },
                steps: [
                  {
                    maneuver: {
                      instruction: 'Hike to Eagle Falls',
                      location: [-120.1037, 38.9550]
                    },
                    distance: 2500,
                    duration: 3600
                  }
                ]
              },
              {
                mode: 'walking',
                from: 'Eagle Falls',
                to: 'Granite Lake',
                distance: 3500,
                duration: 5400,
                geometry: {
                  coordinates: [
                    [-120.0994, 38.9534],
                    [-120.1075, 38.9462],
                    [-120.1156, 38.9391]
                  ]
                },
                steps: [
                  {
                    maneuver: {
                      instruction: 'Hike to Granite Lake',
                      location: [-120.0994, 38.9534]
                    },
                    distance: 3500,
                    duration: 5400
                  }
                ]
              }
            ],
            totalDistance: 21000,
            totalDuration: 10200,
            bounds: [
              [-120.1156, 38.9391], // Southwest
              [-120.0324, 39.0968]  // Northeast
            ]
          },
          itinerary: [
            {
              day: 1,
              title: 'Emerald Bay Wonders',
              description: 'Begin your adventure at the iconic Emerald Bay, exploring hidden trails and spectacular views of the pristine lake waters.',
              activities: [
                {
                  name: 'Eagle Falls Trail Hike',
                  type: 'Hiking',
                  duration: '3-4 hours',
                  description: 'A beautiful moderate hike offering stunning views of Emerald Bay and a close encounter with the majestic Eagle Falls.',
                  permitRequired: true,
                  permitDetails: 'Day use permit required during peak season (May-Sep), available at the trailhead or online.',
                  outfitters: ['Tahoe Rim Trail Association', 'Sports Basement Rental']
                },
                {
                  name: 'Granite Lake Picnic',
                  type: 'Leisure',
                  duration: '1 hour',
                  description: 'Enjoy a peaceful lunch by the crystal-clear waters of Granite Lake, surrounded by towering pines and granite peaks.',
                  permitRequired: false,
                  outfitters: []
                },
                {
                  name: 'Sunset at Inspiration Point',
                  type: 'Sightseeing',
                  duration: '1 hour',
                  description: 'End your day with breathtaking sunset views over Emerald Bay from this famous viewpoint.',
                  permitRequired: false,
                  outfitters: ['Tahoe Adventure Company (guided tours available)']
                }
              ]
            },
            {
              day: 2,
              title: 'Alpine Heights Adventure',
              description: "Challenge yourself with a rewarding hike up one of Tahoe's most celebrated peaks for unparalleled panoramic views.",
              activities: [
                {
                  name: 'Mt. Tallac Hike',
                  type: 'Hiking',
                  duration: '6-8 hours',
                  description: 'A challenging but immensely rewarding hike to the summit of Mt. Tallac, offering 360-degree views of Lake Tahoe and the surrounding Sierra Nevada mountains.',
                  permitRequired: true,
                  permitDetails: 'Wilderness permit required, free at the trailhead self-registration station.',
                  outfitters: ['Sierra Mountain Guides', 'Tahoe Rim Trail Association']
                },
                {
                  name: 'Desolation Wilderness Exploration',
                  type: 'Hiking',
                  duration: '2 hours',
                  description: 'Explore the pristine alpine landscape of Desolation Wilderness with its crystal-clear lakes and striking granite formations.',
                  permitRequired: true,
                  permitDetails: 'Included with Mt. Tallac wilderness permit.',
                  outfitters: []
                }
              ]
            },
            {
              day: 3,
              title: 'Lakeside Leisure',
              description: 'Wind down your adventure with a day of relaxing water activities on the stunning Fallen Leaf Lake, a hidden gem near Lake Tahoe.',
              activities: [
                {
                  name: 'Kayaking on Fallen Leaf Lake',
                  type: 'Water Activity',
                  duration: '3 hours',
                  description: 'Paddle the serene waters of Fallen Leaf Lake, taking in the reflections of mountains and forests as you explore the shoreline.',
                  permitRequired: false,
                  outfitters: ['Kayak Tahoe', 'Tahoe Adventure Company']
                },
                {
                  name: 'Glen Alpine Springs Historic Site',
                  type: 'Cultural/Historical',
                  duration: '1 hour',
                  description: "Visit the historic Glen Alpine Springs resort site and learn about its fascinating history as one of California's first mountain resorts.",
                  permitRequired: false,
                  outfitters: []
                },
                {
                  name: 'Farewell Dinner at Local Brewery',
                  type: 'Dining',
                  duration: '2 hours',
                  description: 'Conclude your trip with a delicious meal and local craft beers at a South Lake Tahoe brewery, sharing stories of your adventure.',
                  permitRequired: false,
                  outfitters: ['South Lake Brewing Company', 'Sidellis Lake Tahoe']
                }
              ]
            }
          ]
        },
        {
          id: '2',
          title: 'Tahoe Adventure: Mountains & Lakes Explorer',
          description: 'Discover the diverse landscapes of the Tahoe region through an exciting combination of mountain hiking and water activities.',
          whyWeChoseThis: 'This trip is designed for those who want variety in their outdoor adventures, combining invigorating hiking with refreshing water activities for a complete Tahoe experience.',
          difficultyLevel: 'Easy-Moderate',
          priceEstimate: '$400-500 per person',
          duration: '3 days',
          location: 'North Lake Tahoe, California',
          suggestedGuides: ['Tahoe Trips & Trails', "Tahoe Jack's Adventure Authority"],
          mapCenter: { lng: -120.1215, lat: 39.1680 },
          markers: [
            { 
              name: 'Tahoe City', 
              coordinates: { lng: -120.1215, lat: 39.1680 },
              description: 'Base for the trip'
            },
            { 
              name: 'Burton Creek State Park', 
              coordinates: { lng: -120.1399, lat: 39.1872 },
              description: 'Day 1 hiking location'
            },
            { 
              name: 'Sand Harbor', 
              coordinates: { lng: -119.9312, lat: 39.1967 },
              description: 'Day 2 paddleboarding location'
            },
            { 
              name: 'Donner Memorial State Park', 
              coordinates: { lng: -120.2326, lat: 39.3205 },
              description: 'Day 3 historical site and hike'
            }
          ],
          journey: {
            segments: [
              {
                mode: 'driving',
                from: 'Tahoe City',
                to: 'Burton Creek State Park',
                distance: 5000,
                duration: 600,
                geometry: {
                  coordinates: [
                    [-120.1215, 39.1680],
                    [-120.1307, 39.1776],
                    [-120.1399, 39.1872]
                  ]
                },
                steps: [
                  {
                    maneuver: {
                      instruction: 'Drive to Burton Creek State Park',
                      location: [-120.1215, 39.1680]
                    },
                    distance: 5000,
                    duration: 600
                  }
                ]
              },
              {
                mode: 'walking',
                from: 'Burton Creek State Park Trailhead',
                to: 'Antone Meadows',
                distance: 4000,
                duration: 4800,
                geometry: {
                  coordinates: [
                    [-120.1399, 39.1872],
                    [-120.1450, 39.1950],
                    [-120.1500, 39.2000]
                  ]
                },
                steps: [
                  {
                    maneuver: {
                      instruction: 'Hike to Antone Meadows',
                      location: [-120.1399, 39.1872]
                    },
                    distance: 4000,
                    duration: 4800
                  }
                ]
              },
              {
                mode: 'driving',
                from: 'Tahoe City',
                to: 'Sand Harbor',
                distance: 25000,
                duration: 1800,
                geometry: {
                  coordinates: [
                    [-120.1215, 39.1680],
                    [-120.0263, 39.1823],
                    [-119.9312, 39.1967]
                  ]
                },
                steps: [
                  {
                    maneuver: {
                      instruction: 'Drive to Sand Harbor',
                      location: [-120.1215, 39.1680]
                    },
                    distance: 25000,
                    duration: 1800
                  }
                ]
              }
            ],
            totalDistance: 34000,
            totalDuration: 7200,
            bounds: [
              [-120.2326, 39.1680], // Southwest
              [-119.9312, 39.3205]  // Northeast
            ]
          },
          itinerary: [
            {
              day: 1,
              title: 'Forest Trails & Alpine Meadows',
              description: 'Begin your Tahoe adventure with a serene hike through lush forests and open meadows in Burton Creek State Park.',
              activities: [
                {
                  name: 'Burton Creek State Park Hike',
                  type: 'Hiking',
                  duration: '4-5 hours',
                  description: 'A gentle hike through diverse ecosystems including pine forests, aspen groves, and the beautiful Antone Meadows.',
                  permitRequired: false,
                  outfitters: ['Tahoe Trips & Trails', 'Tahoe Adventure Maps']
                },
                {
                  name: 'Commons Beach Picnic',
                  type: 'Leisure',
                  duration: '1.5 hours',
                  description: "Enjoy a lakeside lunch at Tahoe City's Commons Beach with beautiful views of the crystal-clear waters.",
                  permitRequired: false,
                  outfitters: []
                },
                {
                  name: 'Evening Cruise on the Tahoe Gal',
                  type: 'Water Activity',
                  duration: '2 hours',
                  description: 'End your day with a scenic sunset cruise on Lake Tahoe aboard the historic paddlewheeler, the Tahoe Gal.',
                  permitRequired: false,
                  outfitters: ['Tahoe Gal Cruises']
                }
              ]
            },
            {
              day: 2,
              title: 'Crystal Waters & Hidden Coves',
              description: "Experience the stunning clarity and beauty of Lake Tahoe's waters up close through paddleboarding and snorkeling.",
              activities: [
                {
                  name: 'Stand-Up Paddleboarding at Sand Harbor',
                  type: 'Water Activity',
                  duration: '3 hours',
                  description: 'Paddle through the crystal-clear waters of Sand Harbor, exploring hidden coves and boulder formations from your paddleboard.',
                  permitRequired: false,
                  outfitters: ['Sand Harbor Rentals', 'Tahoe Adventure Company']
                },
                {
                  name: 'Snorkeling the Boulders',
                  type: 'Water Activity',
                  duration: '2 hours',
                  description: 'Discover the underwater world of Lake Tahoe with a guided snorkeling session around the unique boulder formations.',
                  permitRequired: false,
                  outfitters: ['Clearly Tahoe', 'Tahoe Adventure Company']
                },
                {
                  name: 'Sunset at Hidden Beach',
                  type: 'Leisure',
                  duration: '1 hour',
                  description: 'Relax on the secluded Hidden Beach and enjoy a spectacular sunset over the Sierra Nevada mountains.',
                  permitRequired: false,
                  outfitters: []
                }
              ]
            },
            {
              day: 3,
              title: 'Historical Journey & Mountain Views',
              description: 'Explore the rich history of the Tahoe region while enjoying scenic trails and panoramic mountain vistas.',
              activities: [
                {
                  name: 'Donner Memorial State Park Visit',
                  type: 'Cultural/Historical',
                  duration: '2 hours',
                  description: "Learn about the infamous Donner Party and the area's history at the visitor center, followed by a walk around Donner Lake.",
                  permitRequired: false,
                  outfitters: []
                },
                {
                  name: 'Pacific Crest Trail Segment Hike',
                  type: 'Hiking',
                  duration: '3 hours',
                  description: 'Hike a scenic portion of the legendary Pacific Crest Trail near Donner Pass, enjoying spectacular views of Donner Lake and the surrounding Sierra Nevada.',
                  permitRequired: false,
                  outfitters: ["Tahoe Jack's Adventure Authority", 'Pacific Crest Trail Association']
                },
                {
                  name: 'Farewell Lunch at Donner Lake Kitchen',
                  type: 'Dining',
                  duration: '1.5 hours',
                  description: 'Conclude your Tahoe adventure with a delicious meal at a local favorite restaurant overlooking Donner Lake.',
                  permitRequired: false,
                  outfitters: []
                }
              ]
            }
          ]
        }
      ];
      
      const trip = mockTrips.find(t => t.id === id) || null;
      resolve(trip);
    }, 500);
  });
};

const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        if (!id) {
          toast({
            title: "Error",
            description: "Trip ID is missing",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        setLoading(true);
        const tripData = await fetchTripById(id);
        
        if (!tripData) {
          toast({
            title: "Trip Not Found",
            description: "We couldn't find the trip you're looking for",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        setTrip(tripData);
      } catch (error) {
        console.error("Error loading trip:", error);
        toast({
          title: "Error",
          description: "Failed to load trip details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id, navigate]);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Adventures
      </Button>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading trip details...</p>
        </div>
      ) : trip ? (
        <TripDetailsComponent trip={trip} />
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Trip Not Found</h2>
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>
            Return to Adventures
          </Button>
        </div>
      )}
    </div>
  );
};

export default TripDetailsPage;
