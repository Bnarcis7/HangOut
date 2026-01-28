'use client';

import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';

interface PlaceDetails {
  name: string;
  address: string;
  placeId: string;
  rating?: number;
  priceLevel?: number;
  photos?: string[];
  website?: string;
  phoneNumber?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  value?: string;
}

export default function PlacesAutocomplete({ onPlaceSelect, value }: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: 'weekly',
          libraries: ['places'],
        });

        await loader.importLibrary('places');

        if (!inputRef.current) return;

        // Create autocomplete instance with restaurant-specific options
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['restaurant', 'cafe', 'bar', 'food'],
          fields: [
            'name',
            'formatted_address',
            'place_id',
            'rating',
            'price_level',
            'photos',
            'website',
            'formatted_phone_number',
            'geometry',
          ],
        });

        autocompleteRef.current = autocomplete;

        // Handle place selection
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          if (!place.geometry || !place.geometry.location) {
            setError('No details available for this place');
            return;
          }

          // Extract place details
          const placeDetails: PlaceDetails = {
            name: place.name || '',
            address: place.formatted_address || '',
            placeId: place.place_id || '',
            rating: place.rating,
            priceLevel: place.price_level,
            photos: place.photos?.slice(0, 3).map((photo) => photo.getUrl({ maxWidth: 800 })),
            website: place.website,
            phoneNumber: place.formatted_phone_number,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          };

          onPlaceSelect(placeDetails);
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps. Please try again.');
        setIsLoading(false);
      }
    };

    initAutocomplete();

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onPlaceSelect]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        Restaurant Search
        {isLoading && <span className="ml-2 text-xs text-gray-500">(Loading...)</span>}
      </label>
      <input
        ref={inputRef}
        type="text"
        defaultValue={value}
        placeholder="Search for a restaurant..."
        disabled={isLoading}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <p className="text-xs text-gray-500">
        Start typing to search for restaurants near you
      </p>
    </div>
  );
}
