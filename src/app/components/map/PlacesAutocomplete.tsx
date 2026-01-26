'use client'

import { useMapsLibrary } from '@vis.gl/react-google-maps'

type PlacesAutocompleteProps = {
  onPlaceSelect: (place: string, location?: { lat: number; lng: number }) => void
}

const PlacesAutocomplete = ({ onPlaceSelect }: PlacesAutocompleteProps) => {
  useMapsLibrary('places')

  async function handlePlaceSelect(place: google.maps.places.Place) {
    try {
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location', 'addressComponents']
      })

      const address = place.formattedAddress || place.displayName
      const location = place.location ? { 
        lat: place.location.lat(), 
        lng: place.location.lng() 
      } : undefined

      if (!location) {
        console.error('Place selection failed: No location data available')
        onPlaceSelect(address ?? '', undefined)
        return
      }

      onPlaceSelect(address ?? '', location)
    } catch (error) {
      console.error('Place selection failed:', error)
      onPlaceSelect('', undefined)
    }
  }

  return (
    <div className='flex-1'>
      <style jsx global>{`
        gmp-place-autocomplete {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 1rem;
          outline: none;
          color-scheme: light;
        }
      `}</style>
      <gmp-place-autocomplete
        placeholder='Search by city, address, or ZIP...'
        ongmp-select={(ev) => {
          const place = ev.placePrediction?.toPlace?.() || ev.place
          if (place) void handlePlaceSelect(place)
        }}
        ongmp-placeselect={(ev) => {
          void handlePlaceSelect(ev.place)
        }}
      />
    </div>
  )
}

// Type for place prediction with toPlace method
type PlacePrediction = {
  toPlace?: () => google.maps.places.Place
}

// Type for Google Maps autocomplete events (properties directly on event, not in detail)
type GmpSelectEvent = {
  placePrediction?: PlacePrediction
  place?: google.maps.places.Place
}

type GmpPlaceSelectEvent = {
  place: google.maps.places.Place
}

// Declare the custom element for TypeScript
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-place-autocomplete': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          placeholder?: string
          'ongmp-select'?: (event: GmpSelectEvent) => void
          'ongmp-placeselect'?: (event: GmpPlaceSelectEvent) => void
        },
        HTMLElement
      >
    }
  }
}

export default PlacesAutocomplete
