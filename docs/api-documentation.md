
# Yugen API Documentation

This document outlines the API endpoints, edge functions, and service interactions in the Yugen travel application.

## Supabase Edge Functions

### get-mapbox-token

**Purpose**: Securely provides Mapbox API tokens to the frontend.

**Endpoint**: `https://htypnghgkpqiuhauslmn.supabase.co/functions/v1/get-mapbox-token`

**Method**: POST

**Authentication**: Required (Bearer token)

**Request**: No request body required

**Response**:
```json
{
  "token": "pk.eyJ1Ijoia3NleWxlcnAiLCJhIjoiY204cGJnM2M0MDk1ZjJrb2F3b3o0ZWlnaCJ9.a2VxRsgFb9FwElyHeUUaTw"
}
```

**Error Handling**:
- 401: Unauthorized (invalid or missing token)
- 500: Internal server error (token retrieval failure)

**Usage**:
```typescript
// In useMapboxToken.ts
const { data, error } = await supabase.functions.invoke('get-mapbox-token');
if (data?.token) {
  setMapboxToken(data.token);
}
```

### trip-recommendations

**Purpose**: Generates AI-powered trip recommendations based on user input.

**Endpoint**: `https://htypnghgkpqiuhauslmn.supabase.co/functions/v1/trip-recommendations`

**Method**: POST

**Authentication**: Required (Bearer token)

**Request**:
```json
{
  "prompt": "I'd like to explore the Grand Canyon backcountry for five days"
}
```

**Response**:
```json
{
  "trip": [
    {
      "id": "GC2024-01",
      "title": "Grand Canyon Rim-to-River Wilderness Expedition",
      "description": "An intimate 5-day backcountry journey...",
      "whyWeChoseThis": "This trip offers a deep, immersive experience...",
      "difficultyLevel": "Challenging",
      "priceEstimate": 850,
      "duration": "5 days",
      "location": "Grand Canyon National Park, Arizona",
      "suggestedGuides": ["Southwest Wilderness Guides", "Grand Canyon Hiking Specialists"],
      "mapCenter": { "lng": -112.1129, "lat": 36.0544 },
      "markers": [...],
      "journey": {...},
      "itinerary": [...]
    }
  ]
}
```

**Error Handling**:
- 401: Unauthorized (invalid or missing token)
- 400: Bad request (missing prompt)
- 500: Internal server error (AI processing failure)

**Usage**:
```typescript
// In tripService.ts
const { data, error } = await supabase.functions.invoke('trip-recommendations', {
  body: { prompt: userPrompt }
});
if (data?.trip) {
  return data.trip[0];
}
```

## Frontend Service APIs

### Trip Service

#### fetchTripById

**Purpose**: Retrieves a specific trip by ID.

**Parameters**:
- `id`: String - Trip identifier

**Returns**: Promise<Trip | null>

**Usage**:
```typescript
const trip = await fetchTripById('GC2024-01');
```

#### generateTrips

**Purpose**: Generates trip recommendations based on user prompt.

**Parameters**:
- `prompt`: String - User's trip request
- `options`: Object (optional) - Additional configuration

**Returns**: Promise<Trip[]>

**Usage**:
```typescript
const trips = await generateTrips('I want to hike in Yosemite for a week');
```

#### saveTrip

**Purpose**: Saves a trip to the user's collection.

**Parameters**:
- `trip`: Trip - Trip data to save

**Returns**: Promise<{ id: string }>

**Usage**:
```typescript
const { id } = await saveTrip(tripData);
```

### Buddy Service

#### fetchBuddies

**Purpose**: Retrieves buddies for a specific trip.

**Parameters**:
- `tripId`: String - Trip identifier

**Returns**: Promise<TripBuddy[]>

**Usage**:
```typescript
const buddies = await fetchBuddies('GC2024-01');
```

#### inviteBuddy

**Purpose**: Invites a buddy to join a trip.

**Parameters**:
- `tripId`: String - Trip identifier
- `buddyData`: BuddyData - Buddy information

**Returns**: Promise<TripBuddy>

**Usage**:
```typescript
const newBuddy = await inviteBuddy('GC2024-01', {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '555-555-5555'
});
```

#### updateBuddyStatus

**Purpose**: Updates a buddy's invitation status.

**Parameters**:
- `buddyId`: String - Buddy identifier
- `status`: 'pending' | 'confirmed' | 'declined' - New status

**Returns**: Promise<void>

**Usage**:
```typescript
await updateBuddyStatus('buddy-123', 'confirmed');
```

### Mapbox Service

#### getDirections

**Purpose**: Retrieves directions between two points.

**Parameters**:
- `origin`: [number, number] - Starting coordinates [lng, lat]
- `destination`: [number, number] - Ending coordinates [lng, lat]
- `mode`: 'driving' | 'walking' | 'cycling' | 'transit' - Transport mode

**Returns**: Promise<DirectionsResponse>

**Usage**:
```typescript
const directions = await getDirections(
  [-122.4194, 37.7749], // San Francisco
  [-118.2437, 34.0522], // Los Angeles
  'driving'
);
```

#### combineJourneySegments

**Purpose**: Combines multiple journey segments into a complete journey.

**Parameters**:
- `segments`: Segment[] - Array of journey segments

**Returns**: Journey

**Usage**:
```typescript
const journey = combineJourneySegments(segments);
```

## Database Direct Access

### saved_trips Table

#### insertTrip

**Access**: `supabase.from('saved_trips').insert(tripData)`

**Purpose**: Inserts a new trip record

#### getTrip

**Access**: `supabase.from('saved_trips').select('*').eq('trip_id', id).single()`

**Purpose**: Retrieves a specific trip by ID

#### listSavedTrips

**Access**: `supabase.from('saved_trips').select('*').order('created_at', { ascending: false })`

**Purpose**: Lists all saved trips, newest first

### trip_buddies Table

#### insertBuddy

**Access**: `supabase.from('trip_buddies').insert(buddyData)`

**Purpose**: Inserts a new trip buddy record

#### getBuddiesByTrip

**Access**: `supabase.from('trip_buddies').select('*').eq('trip_id', tripId)`

**Purpose**: Retrieves all buddies for a specific trip

#### updateBuddy

**Access**: `supabase.from('trip_buddies').update({ status }).eq('id', buddyId)`

**Purpose**: Updates a buddy's record (typically status)

## External API Integrations

### Mapbox API

**Base URL**: `https://api.mapbox.com`

**API Version**: `v5`

**Authentication**: Access token required in all requests

#### Directions API

**Endpoint**: `/directions/v5/mapbox/{profile}/{coordinates}`

**Method**: GET

**Parameters**:
- `profile`: String - Mode of transportation (driving, walking, cycling)
- `coordinates`: String - Comma-separated coordinates
- `access_token`: String - Mapbox access token

**Example Request**:
```
https://api.mapbox.com/directions/v5/mapbox/driving/-122.4194,37.7749;-118.2437,34.0522?access_token=YOUR_TOKEN
```

#### Geocoding API

**Endpoint**: `/geocoding/v5/{endpoint}/{search_text}.json`

**Method**: GET

**Parameters**:
- `endpoint`: String - Type of geocoding (mapbox.places)
- `search_text`: String - Place name or address to geocode
- `access_token`: String - Mapbox access token

**Example Request**:
```
https://api.mapbox.com/geocoding/v5/mapbox.places/Grand%20Canyon.json?access_token=YOUR_TOKEN
```

### Claude AI API

**Access Method**: Via Supabase Edge Function (trip-recommendations)

**Purpose**: Generate personalized trip recommendations

**Input**: Natural language trip request

**Output**: Structured trip data including itinerary, map locations, and activities

**Integration Flow**:
1. User submits trip request
2. Request forwarded to edge function
3. Edge function calls Claude API with formatted prompt
4. Claude generates structured trip response
5. Response parsed and returned to frontend
6. Frontend displays trip recommendation
