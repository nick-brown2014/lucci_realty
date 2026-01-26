'use client'

import { useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef } from 'react'

type StreetViewPanoramaProps = {
  position: { lat: number; lng: number }
}

const StreetViewPanorama = ({ position }: StreetViewPanoramaProps) => {
  const map = useMap()
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!map || !containerRef.current) return

    const panorama = new google.maps.StreetViewPanorama(containerRef.current, {
      position,
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      addressControl: true,
      linksControl: true,
      panControl: true,
      enableCloseButton: false,
    })

    panoramaRef.current = panorama
    map.setStreetView(panorama)

    return () => {
      if (panoramaRef.current) {
        panoramaRef.current.setVisible(false)
      }
    }
  }, [map, position])

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ minHeight: '256px' }}
    />
  )
}

export default StreetViewPanorama
