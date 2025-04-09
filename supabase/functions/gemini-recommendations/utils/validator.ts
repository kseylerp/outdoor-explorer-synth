
// Validate the trip data structure
export function validateTripData(tripData: any) {
  if (!tripData) {
    throw new Error("No valid JSON data could be extracted from response");
  }
  
  if (!tripData.trip) {
    throw new Error("Missing 'trip' property in parsed data");
  }
  
  if (!Array.isArray(tripData.trip)) {
    throw new Error("'trip' property is not an array");
  }
  
  if (tripData.trip.length === 0) {
    throw new Error("'trip' array is empty - no trips generated");
  }
  
  // Validate required fields in each trip
  for (let i = 0; i < tripData.trip.length; i++) {
    const trip = tripData.trip[i];
    const missingFields = [];
    
    if (!trip.id) missingFields.push("id");
    if (!trip.title) missingFields.push("title");
    if (!trip.description) missingFields.push("description");
    if (!trip.whyWeChoseThis) missingFields.push("whyWeChoseThis");
    if (!trip.difficultyLevel) missingFields.push("difficultyLevel");
    if (trip.priceEstimate === undefined) missingFields.push("priceEstimate");
    if (!trip.duration) missingFields.push("duration");
    if (!trip.location) missingFields.push("location");
    if (!trip.mapCenter) missingFields.push("mapCenter");
    if (!trip.itinerary) missingFields.push("itinerary");
    
    if (missingFields.length > 0) {
      throw new Error(`Trip at index ${i} is missing required fields: ${missingFields.join(", ")}`);
    }
  }
  
  console.log("Successfully parsed trip data:", tripData.trip.length, "trips");
  return tripData;
}
