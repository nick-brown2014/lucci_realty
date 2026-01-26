'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import useListing from '@/app/hooks/useListing'
import Footer from '@/app/components/Footer'
import Slideshow from '@/app/components/Slideshow'
import SearchNav from '@/app/components/SearchNav'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { MAP_CONFIG } from '@/config/mapConfig'
import StreetViewPanorama from '@/app/components/map/StreetViewPanorama'

type MapStyleKey = 'default' | 'satellite' | 'terrain'

type ListingPageProps = {
  params: Promise<{
    listing_id: string
  }>
}

const ListingPage = ({ params }: ListingPageProps) => {
  const { listing_id } = use(params)
  const { listing, brokerage, loading } = useListing(listing_id)
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [mapStyle, setMapStyle] = useState<MapStyleKey>('default')
  const [showStreetView, setShowStreetView] = useState(false)

  if (!!loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-xl text-gray-600'>Loading...</p>
      </div>
    )
  }
  if (!listing || !brokerage) return <></>
  const calenderLink = `https://link.myagenthq.com/widget/booking/47IzUUa70aauUUFLHFuU?address=${listing.UnparsedAddress}`

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const openSlideshow = (index: number = 0) => {
    setSelectedImageIndex(index)
    setIsSlideshowOpen(true)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <SearchNav />
      <div className='max-w-7xl mx-auto px-4 py-8 mt-16'>
        {/* Hero Image Gallery */}
        <div className='w-[100%] mx-auto mb-8 relative'>
          {listing.Media && listing.Media.length > 0 ? (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2 h-[350px] overflow-hidden rounded-4xl'>
                {/* Large image on the left */}
                <div className='relative h-full bg-gray-200' onClick={() => openSlideshow(0)}>
                  <Image
                    src={listing.Media[0].MediaURL}
                    alt={`${listing.streetAddress} property`}
                    fill
                    className='object-cover cursor-pointer hover:opacity-90'
                    priority
                  />
                </div>

                {/* Grid of 4 smaller images on the right */}
                <div className='hidden md:grid grid-cols-2 grid-rows-2 gap-2'>
                  {listing.Media.slice(1, 5).map((media, index) => (
                    <div
                      key={media.MediaObjectID || index}
                      className='relative bg-gray-200'
                      onClick={() => openSlideshow(index + 1)}
                    >
                      <Image
                        src={media.MediaURL}
                        alt={`${listing.streetAddress} property ${index + 2}`}
                        fill
                        className='object-cover cursor-pointer hover:opacity-90'
                      />
                    </div>
                  ))}
                  {/* Fill empty slots if less than 5 images */}
                  {listing.Media.length < 5 && Array.from({ length: 5 - listing.Media.length }).map((_, index) => (
                    <div key={`empty-${index}`} className='relative bg-gray-200 flex items-center justify-center'>
                      <p className='text-gray-400 text-sm'>No photo</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Buttons */}
              <div className='absolute bottom-4 right-4 flex gap-2'>
                <button
                  onClick={() => openSlideshow(0)}
                  className='cursor-pointer bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow font-semibold text-gray-900 border border-gray-300'
                >
                  Slideshow
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`/listing/${listing.ListingKey}/gallery`, '_blank')
                  }}
                  className='cursor-pointer bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow font-semibold text-gray-900 border border-gray-300'
                >
                  All Photos ({listing.Media.length})
                </button>
              </div>
            </>
          ) : (
            <div className='w-full h-[500px] bg-gray-200 rounded-3xl flex items-center justify-center'>
              <p className='text-gray-400 text-lg'>No photos available</p>
            </div>
          )}
        </div>

        {/* Schedule a meeting modal */}
        { scheduleModalOpen && (
          <div
            className='fixed inset-0 z-50 flex items-center justify-center'
            onClick={() => setScheduleModalOpen(false)}
          >
            <div
              className='w-[90vw] h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col justify-center items-center py-12 relative'
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setScheduleModalOpen(false)}
                className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer'
                aria-label='Close modal'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
              <h1 className='text-2xl mb-12 lg:mb-0 lg:text-3xl font-semibold tracking-tight'>Schedule a tour</h1>
              <iframe src={calenderLink} width='98%' height='98%' />
            </div>
          </div>
        ) }

        {/* Slideshow */}
        {listing.Media && (
          <Slideshow
            media={listing.Media}
            isOpen={isSlideshowOpen}
            initialIndex={selectedImageIndex}
            onClose={() => setIsSlideshowOpen(false)}
          />
        )}

        {/* Price and Address Header */}
        <div className='flex flex-col md:flex-row md:justify-between md:items-center w-full mb-12'>
          <div>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-3'>
              {formatPrice(listing.ListPrice)}
            </h1>
            <p className='text-xl md:text-2xl text-gray-700 mb-8 md:mb-0'>
              {listing.UnparsedAddress}
            </p>
          </div>
          <button
                onClick={() => setScheduleModalOpen(true)}
                className='w-full md:w-auto text-2xl cursor-pointer bg-white h-12 px-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow font-semibold text-primary border-2 border-primary'
              >
                Schedule a tour
              </button>
        </div>

        {/* Key Stats Bar */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {listing.PropertyType !== 'Land' && (
              <>
                <div className='text-center'>
                  <p className='text-3xl font-bold text-primary mb-1'>{listing.BedroomsTotal}</p>
                  <p className='text-sm text-gray-600 uppercase tracking-wide'>Bedrooms</p>
                </div>
                <div className='text-center'>
                  <p className='text-3xl font-bold text-primary mb-1'>
                    {listing.BathroomsTotalInteger ?? listing.BathroomsFull}
                  </p>
                  <p className='text-sm text-gray-600 uppercase tracking-wide'>Bathrooms</p>
                </div>
                <div className='text-center'>
                  <p className='text-3xl font-bold text-primary mb-1'>
                    {listing.LivingArea?.toLocaleString()}
                  </p>
                  <p className='text-sm text-gray-600 uppercase tracking-wide'>Sq Ft</p>
                </div>
              </>
            )}
            <div className='text-center'>
              <p className='text-3xl font-bold text-primary mb-1'>
                {listing.LotSizeAcres?.toFixed(2) || '—'}
              </p>
              <p className='text-sm text-gray-600 uppercase tracking-wide'>Acres</p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Overview Section */}
            {listing.PublicRemarks && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>Overview</h2>
                <p className='text-gray-700 leading-relaxed whitespace-pre-line'>
                  {listing.PublicRemarks}
                </p>
              </div>
            )}

            {/* Property Details */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>Property Details</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-3'>
                  {listing.ListingId && (
                    <div className='flex justify-between py-2 border-b border-gray-200'>
                      <span className='text-gray-600'>MLS Number</span>
                      <span className='font-medium text-gray-900'>{listing.ListingId}</span>
                    </div>
                  )}
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span className='text-gray-600'>Property Type</span>
                    <span className='font-medium text-gray-900'>{listing.PropertySubType}</span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span className='text-gray-600'>Status</span>
                    <span className='font-medium text-gray-900'>
                      {listing.MlsStatus}
                    </span>
                  </div>
                  {listing.YearBuilt && (
                    <div className='flex justify-between py-2 border-b border-gray-200'>
                      <span className='text-gray-600'>Year Built</span>
                      <span className='font-medium text-gray-900'>{listing.YearBuilt}</span>
                    </div>
                  )}
                  {listing.Stories && (
                    <div className='flex justify-between py-2 border-b border-gray-200'>
                      <span className='text-gray-600'>Stories</span>
                      <span className='font-medium text-gray-900'>{listing.Stories}</span>
                    </div>
                  )}
                  {listing.GarageSpaces > 0 && (
                    <div className='flex justify-between py-2 border-b border-gray-200'>
                      <span className='text-gray-600'>Garage Spaces</span>
                      <span className='font-medium text-gray-900'>{listing.GarageSpaces}</span>
                    </div>
                  )}
                </div>
                <div className='space-y-3'>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span className='text-gray-600'>Days on Market</span>
                    <span className='font-medium text-gray-900'>{listing.DaysOnMarket}</span>
                  </div>
                  {listing.LotSizeSquareFeet && (
                    <div className='flex justify-between py-2 border-b border-gray-200'>
                      <span className='text-gray-600'>Lot Size (Sq Ft)</span>
                      <span className='font-medium text-gray-900'>
                        {listing.LotSizeSquareFeet.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {listing.TaxAnnualAmount && (
                    <div className='flex justify-between py-2 border-b border-gray-200'>
                      <span className='text-gray-600'>Annual Taxes</span>
                      <span className='font-medium text-gray-900'>
                        {formatPrice(listing.TaxAnnualAmount)}
                      </span>
                    </div>
                  )}
                  {listing.SubdivisionName && (
                    <div className='flex justify-between py-2 border-b border-gray-200'>
                      <span className='text-gray-600'>Subdivision</span>
                      <span className='font-medium text-gray-900'>{listing.SubdivisionName}</span>
                    </div>
                  )}
                  {listing.ParcelNumber && (
                    <div className='flex justify-between py-2 border-b border-gray-200'>
                      <span className='text-gray-600'>Parcel Number</span>
                      <span className='font-medium text-gray-900 text-sm'>
                        {listing.ParcelNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interior Features */}
            {(listing.Appliances?.length || listing.InteriorFeatures?.length || listing.Flooring?.length) && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>Interior Features</h2>
                <div className='space-y-4'>
                  {listing.Appliances && listing.Appliances.length > 0 && (
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-2'>Appliances</h3>
                      <p className='text-gray-700'>{listing.Appliances.join(', ')}</p>
                    </div>
                  )}
                  {listing.Flooring && listing.Flooring.length > 0 && (
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-2'>Flooring</h3>
                      <p className='text-gray-700'>{listing.Flooring.join(', ')}</p>
                    </div>
                  )}
                  {listing.InteriorFeatures && listing.InteriorFeatures.length > 0 && (
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-2'>Features</h3>
                      <p className='text-gray-700'>{listing.InteriorFeatures.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Exterior Features */}
            {(listing.ExteriorFeatures?.length || listing.LotFeatures?.length) && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>Exterior Features</h2>
                <div className='space-y-4'>
                  {listing.ExteriorFeatures && listing.ExteriorFeatures.length > 0 && (
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-2'>Exterior</h3>
                      <p className='text-gray-700'>{listing.ExteriorFeatures.join(', ')}</p>
                    </div>
                  )}
                  {listing.LotFeatures && listing.LotFeatures.length > 0 && (
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-2'>Lot Features</h3>
                      <p className='text-gray-700'>{listing.LotFeatures.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Utilities */}
            {(listing.Heating?.length || listing.Cooling?.length || listing.WaterSource?.length || listing.Sewer?.length) && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>Utilities</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {listing.Heating && listing.Heating.length > 0 && (
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-2'>Heating</h3>
                      <p className='text-gray-700 text-sm'>{listing.Heating.join(', ')}</p>
                    </div>
                  )}
                  {listing.Cooling && listing.Cooling.length > 0 && (
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-2'>Cooling</h3>
                      <p className='text-gray-700 text-sm'>{listing.Cooling.join(', ')}</p>
                    </div>
                  )}
                  {listing.WaterSource && listing.WaterSource.length > 0 && (
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-2'>Water</h3>
                      <p className='text-gray-700 text-sm'>{listing.WaterSource.join(', ')}</p>
                    </div>
                  )}
                  {listing.Sewer && listing.Sewer.length > 0 && (
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-2'>Sewer</h3>
                      <p className='text-gray-700 text-sm'>{listing.Sewer.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Agent Information */}
            {listing.ListAgentFullName && (
              <div className='bg-white rounded-lg shadow-md py-4 px-6 hidden md:flex flex-col'>
                <p className='font-semibold text-gray-900'>Listing Agent: <span className='font-normal'>{listing.ListAgentFullName}</span></p>
                <p className='font-semibold text-gray-900'>Brokerage: <span className='font-normal'>{brokerage.OfficeName}</span></p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Pricing Information */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>Pricing</h2>
              <div className='space-y-3'>
                <div className='flex justify-between py-2 border-b border-gray-200'>
                  <span className='text-gray-600'>List Price</span>
                  <span className='font-semibold text-gray-900'>
                    {formatPrice(listing.ListPrice)}
                  </span>
                </div>
                {listing.OriginalListPrice && listing.OriginalListPrice !== listing.ListPrice && (
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span className='text-gray-600'>Original Price</span>
                    <span className='font-medium text-gray-900'>
                      {formatPrice(listing.OriginalListPrice)}
                    </span>
                  </div>
                )}
                {listing.ClosePrice && (
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span className='text-gray-600'>Close Price</span>
                    <span className='font-medium text-gray-900'>
                      {formatPrice(listing.ClosePrice)}
                    </span>
                  </div>
                )}
              </div>
            </div>

                        {/* Map */}
                        {listing.Latitude && listing.Longitude && (
                          <div className='bg-white rounded-lg shadow-md p-6'>
                            <div className='flex justify-between items-center mb-4'>
                              <h2 className='text-xl font-bold text-gray-900'>Location</h2>
                              <div className='flex gap-2'>
                                <button
                                  onClick={() => setShowStreetView(!showStreetView)}
                                  className={`px-3 py-1 text-sm rounded-md transition ${
                                    showStreetView 
                                      ? 'bg-primary text-white' 
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {showStreetView ? 'Map View' : 'Street View'}
                                </button>
                                {!showStreetView && (
                                  <select
                                    value={mapStyle}
                                    onChange={(e) => setMapStyle(e.target.value as MapStyleKey)}
                                    className='px-2 py-1 text-sm border border-gray-300 rounded-md bg-white'
                                  >
                                    <option value="default">Default</option>
                                    <option value="satellite">Satellite</option>
                                    <option value="terrain">Terrain</option>
                                  </select>
                                )}
                              </div>
                            </div>
                            <div className='w-full h-64 rounded-lg overflow-hidden'>
                              <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                                {showStreetView ? (
                                  <Map
                                    defaultCenter={{ lat: listing.Latitude, lng: listing.Longitude }}
                                    defaultZoom={MAP_CONFIG.detailZoom}
                                    mapId={MAP_CONFIG.mapId.detail}
                                    streetViewControl={false}
                                  >
                                    <StreetViewPanorama
                                      position={{ lat: listing.Latitude, lng: listing.Longitude }}
                                    />
                                  </Map>
                                ) : (
                                  <Map
                                    defaultCenter={{ lat: listing.Latitude, lng: listing.Longitude }}
                                    defaultZoom={MAP_CONFIG.detailZoom}
                                    mapId={MAP_CONFIG.mapId.detail}
                                    mapTypeId={mapStyle === 'satellite' ? 'satellite' : mapStyle === 'terrain' ? 'terrain' : 'roadmap'}
                                    disableDefaultUI={true}
                                    zoomControl={true}
                                  >
                                    <AdvancedMarker
                                      position={{ lat: listing.Latitude, lng: listing.Longitude }}
                                    >
                                      <div className='w-6 h-6 bg-primary rounded-full border-4 border-white shadow-lg'></div>
                                    </AdvancedMarker>
                                  </Map>
                                )}
                              </APIProvider>
                            </div>
                          </div>
                        )}

            {/* HOA Information */}
            {listing.AssociationYN && listing.AssociationFee && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>HOA</h2>
                <div className='space-y-3'>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span className='text-gray-600'>HOA Fee</span>
                    <span className='font-semibold text-gray-900'>
                      {formatPrice(listing.AssociationFee)}/{listing.AssociationFeeFrequency}
                    </span>
                  </div>
                  {listing.AssociationFeeIncludes && listing.AssociationFeeIncludes.length > 0 && (
                    <div>
                      <p className='text-sm text-gray-600 mb-1'>Includes:</p>
                      <p className='text-sm text-gray-700'>
                        {listing.AssociationFeeIncludes.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Schools */}
            {(listing.ElementarySchool || listing.MiddleOrJuniorSchool || listing.HighSchool) && (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>Schools</h2>
                <div className='space-y-3'>
                  {listing.ElementarySchool && (
                    <div>
                      <p className='text-sm text-gray-600'>Elementary</p>
                      <p className='font-medium text-gray-900'>{listing.ElementarySchool}</p>
                    </div>
                  )}
                  {listing.MiddleOrJuniorSchool && (
                    <div>
                      <p className='text-sm text-gray-600'>Middle School</p>
                      <p className='font-medium text-gray-900'>{listing.MiddleOrJuniorSchool}</p>
                    </div>
                  )}
                  {listing.HighSchool && (
                    <div>
                      <p className='text-sm text-gray-600'>High School</p>
                      <p className='font-medium text-gray-900'>{listing.HighSchool}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Agent Information */}
            {listing.ListAgentFullName && (
              <div className='bg-white rounded-lg shadow-md py-4 px-6 flex flex-col md:hidden'>
                <p className='font-semibold text-gray-900'>Listing Agent: <span className='font-normal'>{listing.ListAgentFullName}</span></p>
                <p className='font-semibold text-gray-900'>Brokerage: <span className='font-normal'>{brokerage.OfficeName}</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ListingPage
