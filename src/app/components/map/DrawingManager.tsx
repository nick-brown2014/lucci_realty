'use client'

import { useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'

type DrawingManagerProps = {
  enabled: boolean
  onRectangleComplete: (bounds: google.maps.LatLngBounds) => void
  onDrawingCancelled?: () => void
}

const DrawingManager = ({ enabled, onRectangleComplete, onDrawingCancelled }: DrawingManagerProps) => {
  const map = useMap()
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null)
  const currentOverlayRef = useRef<google.maps.Rectangle | null>(null)
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false)

  useEffect(() => {
    if (!window.google?.maps?.drawing) {
      const checkLibrary = setInterval(() => {
        if (window.google?.maps?.drawing) {
          setIsLibraryLoaded(true)
          clearInterval(checkLibrary)
        }
      }, 100)
      return () => clearInterval(checkLibrary)
    } else {
      setIsLibraryLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!map || !isLibraryLoaded) return

    if (!drawingManagerRef.current) {
      drawingManagerRef.current = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        rectangleOptions: {
          fillColor: '#1e3a5f',
          fillOpacity: 0.2,
          strokeColor: '#1e3a5f',
          strokeWeight: 2,
          editable: false,
          draggable: false,
        },
      })
      drawingManagerRef.current.setMap(map)

      google.maps.event.addListener(
        drawingManagerRef.current,
        'rectanglecomplete',
        (rectangle: google.maps.Rectangle) => {
          if (currentOverlayRef.current) {
            currentOverlayRef.current.setMap(null)
          }
          currentOverlayRef.current = rectangle

          const bounds = rectangle.getBounds()
          if (bounds) {
            onRectangleComplete(bounds)
          }

          rectangle.setMap(null)
          currentOverlayRef.current = null

          if (drawingManagerRef.current) {
            drawingManagerRef.current.setDrawingMode(null)
          }
        }
      )
    }

    return () => {
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(null)
        drawingManagerRef.current = null
      }
      if (currentOverlayRef.current) {
        currentOverlayRef.current.setMap(null)
        currentOverlayRef.current = null
      }
    }
  }, [map, isLibraryLoaded, onRectangleComplete])

  useEffect(() => {
    if (!drawingManagerRef.current || !isLibraryLoaded) return

    if (enabled) {
      drawingManagerRef.current.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE)
    } else {
      drawingManagerRef.current.setDrawingMode(null)
      if (currentOverlayRef.current) {
        currentOverlayRef.current.setMap(null)
        currentOverlayRef.current = null
      }
    }
  }, [enabled, isLibraryLoaded])

  useEffect(() => {
    if (!map || !enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (drawingManagerRef.current) {
          drawingManagerRef.current.setDrawingMode(null)
        }
        if (currentOverlayRef.current) {
          currentOverlayRef.current.setMap(null)
          currentOverlayRef.current = null
        }
        onDrawingCancelled?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [map, enabled, onDrawingCancelled])

  return null
}

export default DrawingManager
