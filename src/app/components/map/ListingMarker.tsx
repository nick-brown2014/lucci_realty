'use client'

import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps'
import { useState } from 'react'
import { Listing } from '@/app/hooks/useMapDisplay'
import Image from 'next/image'

type ListingMarkerProps = {
  listing: Listing
}

const ListingMarker = ({ listing }: ListingMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef()
  const [infoWindowShown, setInfoWindowShown] = useState(false)

  if (!listing.Latitude || !listing.Longitude) return null

  const handleMarkerClick = () => {
    window.open(`/listing/${listing.ListingKey}`, '_blank')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPhotoUrl = () => {
    // Use the first photo from Media array
    if (listing.Media && listing.Media.length > 0) {
      return listing.Media[0].MediaURL
    }
    return null
  }

  return (
    <>
            <AdvancedMarker
              ref={markerRef}
              position={{ lat: listing.Latitude, lng: listing.Longitude }}
              onMouseEnter={() => setInfoWindowShown(true)}
              onMouseLeave={() => setInfoWindowShown(false)}
              onClick={handleMarkerClick}
              className="cursor-pointer transform transition-transform hover:scale-110"
            >
              <div className="bg-primary text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg hover:bg-secondary transition-all duration-200 hover:shadow-xl">
                {formatPrice(listing.ListPrice)}
              </div>
            </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setInfoWindowShown(false)}
          headerDisabled
          disableAutoPan={true}
        >
          <div className="w-56 cursor-pointer" onClick={handleMarkerClick}>
            <div className="relative w-full h-32 bg-gray-200">
              {getPhotoUrl() ? (
                <Image
                  src={getPhotoUrl()!}
                  alt={`${listing.streetAddress} property`}
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
                {formatPrice(listing.ListPrice)}
              </p>
              <p className="text-xs text-gray-800 mb-1">
                {listing.UnparsedAddress}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                {listing.PropertyType === 'Land' ? (
                  listing.LotSizeAcres && `${listing.LotSizeAcres} acres`
                ) : (
                  <>
                    {listing.BedroomsTotal} bd | {listing.BathroomsTotalInteger ?? listing.BathroomsFull} ba
                    {listing.LivingArea && ` | ${listing.LivingArea.toLocaleString()} sqft`}
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500">
                {listing.MlsStatus} • {listing.DaysOnMarket} days
              </p>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  )
}

export default ListingMarker
