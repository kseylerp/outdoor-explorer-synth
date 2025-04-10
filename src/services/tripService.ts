
// Re-export everything from the new modular structure
export { generateTrips, fetchTripById } from './trip/tripService';

// Re-export the services from dataService to maintain backwards compatibility
export { fetchGuides, fetchActivities } from './trip/dataService';
