import { MAP_CONFIG } from '@/config/mapConfig'

export const useMapBounds = () => {
  const createBoundsFromLocation = (location: { lat: number; lng: number }, radius: number = MAP_CONFIG.searchRadius) => {
    const center = new google.maps.LatLng(location.lat, location.lng)
    const circle = new google.maps.Circle({ center, radius })
    return circle.getBounds()
  }

  const getBoundsWithPadding = (bounds: google.maps.LatLngBounds, paddingPercent: number = 0.1) => {
    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()
    
    const latPadding = (ne.lat() - sw.lat()) * paddingPercent
    const lngPadding = (ne.lng() - sw.lng()) * paddingPercent
    
    return new google.maps.LatLngBounds(
      { lat: sw.lat() + latPadding, lng: sw.lng() + lngPadding },
      { lat: ne.lat() - latPadding, lng: ne.lng() - lngPadding }
    )
  }

  return { createBoundsFromLocation, getBoundsWithPadding }
}
