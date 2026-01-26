'use client'

import { useMap, AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps'
import { MarkerClusterer as GoogleMarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Listing } from '@/app/hooks/useMapDisplay'
import Image from 'next/image'

type ClusteredMarkersProps = {
  listings: Listing[]
}

const ClusteredMarkers = ({ listings }: ClusteredMarkersProps) => {
  const map = useMap()
  const clustererRef = useRef<GoogleMarkerClusterer | null>(null)
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map())
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [selectedMarkerRef, selectedMarker] = useAdvancedMarkerRef()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPhotoUrl = (listing: Listing) => {
    if (listing.Media && listing.Media.length > 0) {
      return listing.Media[0].MediaURL
    }
    return null
  }

  const handleMarkerClick = useCallback((listing: Listing) => {
    window.open(`/listing/${listing.ListingKey}`, '_blank')
  }, [])

  useEffect(() => {
    if (!map) return

    if (!clustererRef.current) {
      clustererRef.current = new GoogleMarkerClusterer({
        map,
        algorithm: new SuperClusterAlgorithm({ radius: 80 }),
      })
    }

    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers()
        clustererRef.current = null
      }
    }
  }, [map])

  useEffect(() => {
    if (!clustererRef.current || !map) return

    const currentMarkers = markersRef.current
    const newMarkerKeys = new Set(listings.map(l => l.ListingKey))

    // Remove markers that are no longer in listings
    currentMarkers.forEach((marker, key) => {
      if (!newMarkerKeys.has(key)) {
        clustererRef.current?.removeMarker(marker)
        currentMarkers.delete(key)
      }
    })

    // Add new markers
    listings.forEach(listing => {
      if (!listing.Latitude || !listing.Longitude) return
      if (currentMarkers.has(listing.ListingKey)) return

      const content = document.createElement('div')
      content.className = 'bg-primary text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg hover:bg-secondary transition-colors cursor-pointer'
      content.textContent = formatPrice(listing.ListPrice)
      content.style.cssText = 'background-color: #1e3a5f; color: white; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); cursor: pointer;'

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: listing.Latitude, lng: listing.Longitude },
        content,
      })

      marker.addListener('click', () => handleMarkerClick(listing))
      marker.addListener('mouseenter', () => setSelectedListing(listing))
      marker.addListener('mouseleave', () => setSelectedListing(null))

      currentMarkers.set(listing.ListingKey, marker)
      clustererRef.current?.addMarker(marker)
    })
  }, [listings, map, handleMarkerClick])

  return (
    <>
      {selectedListing && selectedListing.Latitude && selectedListing.Longitude && (
        <>
          <AdvancedMarker
            ref={selectedMarkerRef}
            position={{ lat: selectedListing.Latitude, lng: selectedListing.Longitude }}
            style={{ opacity: 0, pointerEvents: 'none' }}
          />
          <InfoWindow
            anchor={selectedMarker}
            onCloseClick={() => setSelectedListing(null)}
            headerDisabled
            disableAutoPan={true}
          >
            <div className="w-56 cursor-pointer" onClick={() => handleMarkerClick(selectedListing)}>
              <div className="relative w-full h-32 bg-gray-200">
                {getPhotoUrl(selectedListing) ? (
                  <Image
                    src={getPhotoUrl(selectedListing)!}
                    alt={`${selectedListing.streetAddress} property`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No photo
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="font-bold text-base text-primary mb-1">
                  {formatPrice(selectedListing.ListPrice)}
                </p>
                <p className="text-xs text-gray-800 mb-1">
                  {selectedListing.UnparsedAddress}
                </p>
                <p className="text-xs text-gray-600 mb-1">
                  {selectedListing.PropertyType === 'Land' ? (
                    selectedListing.LotSizeAcres && `${selectedListing.LotSizeAcres} acres`
                  ) : (
                    <>
                      {selectedListing.BedroomsTotal} bd | {selectedListing.BathroomsTotalInteger ?? selectedListing.BathroomsFull} ba
                      {selectedListing.LivingArea && ` | ${selectedListing.LivingArea.toLocaleString()} sqft`}
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedListing.MlsStatus} • {selectedListing.DaysOnMarket} days
                </p>
              </div>
            </div>
          </InfoWindow>
        </>
      )}
    </>
  )
}

export default ClusteredMarkers
