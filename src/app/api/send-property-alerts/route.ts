import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { SavedSearch } from '@/app/types/SavedSearch'
import { Listing } from '@/app/hooks/useMapDisplay'
import PropertyAlertEmail from '../../../../emails/PropertyAlertEmail'

interface EmailProperty {
  id: string
  address: string
  price: number
  beds: number
  baths: number
  sqft: number
  imageUrl?: string
  listingUrl: string
}

export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized (from Vercel Cron or with proper secret)
    const authHeader = request.headers.get('authorization')
    const secret = request.nextUrl.searchParams.get('secret')

    // Check either Bearer token (Vercel Cron) or secret query param
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Initialize Resend with API key
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY not configured' },
        { status: 500 }
      )
    }
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Get all users who have opted in to emails
    // For testing: only send to nick.brown2014@gmail.com
    const testMode = request.nextUrl.searchParams.get('test') === 'true'
    const optedInUsers = await prisma.user.findMany({
      where: {
        emailOptIn: true,
        ...(testMode && { email: 'nick.brown2014@gmail.com' })
      },
      include: {
        savedSearches: true
      }
    })

    console.log(`Found ${optedInUsers.length} users with email opt-in`)

    let emailsSent = 0
    const errors: string[] = []

    // For each user with saved searches, check for new listings
    for (const user of optedInUsers) {
      if (user.savedSearches.length === 0) continue

      try {
        // Collect all new listings across all saved searches for this user
        const searchResults: Array<{
          searchId: string
          searchName: string
          properties: Array<{
            address: string
            price: number
            beds: number
            baths: number
            sqft: number
            imageUrl?: string
            listingUrl: string
          }>
        }> = []

        for (const savedSearch of user.savedSearches) {
          try {
            // Convert Prisma null values to undefined to match SavedSearch type
            const searchParams: SavedSearch = {
              id: savedSearch.id,
              userId: savedSearch.userId,
              createdAt: savedSearch.createdAt,
              updatedAt: savedSearch.updatedAt,
              name: savedSearch.name,
              searchQuery: savedSearch.searchQuery ?? undefined,
              minPrice: savedSearch.minPrice ?? undefined,
              maxPrice: savedSearch.maxPrice ?? undefined,
              minBeds: savedSearch.minBeds ?? undefined,
              minBaths: savedSearch.minBaths ?? undefined,
              propertyTypes: savedSearch.propertyTypes as string[],
              includeLand: savedSearch.includeLand,
              statuses: savedSearch.statuses as string[],
              bounds: savedSearch.bounds ? savedSearch.bounds as SavedSearch['bounds'] : undefined
            }

            const newProperties = await fetchNewListingsForSearch(searchParams)

            if (newProperties.length > 0) {
              searchResults.push({
                searchId: savedSearch.id,
                searchName: savedSearch.name,
                properties: newProperties.map(p => ({
                  address: p.address,
                  price: p.price,
                  beds: p.beds,
                  baths: p.baths,
                  sqft: p.sqft,
                  imageUrl: p.imageUrl,
                  listingUrl: `${process.env.NEXTAUTH_URL}/listing/${p.id}`
                }))
              })
            }
          } catch (err) {
            console.error(`Error processing search "${savedSearch.name}" for ${user.email}:`, err)
          }
        }

        // Only send email if we found new properties across any saved search
        if (searchResults.length === 0) continue

        const totalProperties = searchResults.reduce((sum, result) => sum + result.properties.length, 0)

        // Send consolidated email using Resend
        const { error } = await resend.emails.send({
          from: 'TODO: NAME <noreply@alerts.domain.com>',
          to: [user.email],
          subject: `${totalProperties} New ${totalProperties === 1 ? 'Listing' : 'Listings'} Just Hit the Market!`,
          react: PropertyAlertEmail({
            userName: `${user.firstName} ${user.lastName}`,
            searchResults
          })
        })

        if (error) {
          console.error(`Error sending email to ${user.email}:`, error)
          errors.push(`${user.email}: ${error.message}`)
        } else {
          console.log(`Email sent to ${user.email} with ${totalProperties} new properties from ${searchResults.length} saved searches`)
          emailsSent++
        }
      } catch (err) {
        console.error(`Error processing user ${user.email}:`, err)
        errors.push(`${user.email}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      usersProcessed: optedInUsers.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    console.error('Send property alerts error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper function to fetch new listings for a saved search
async function fetchNewListingsForSearch(savedSearch: SavedSearch): Promise<EmailProperty[]> {
  try {
    // Build filters based on saved search criteria
    const filters: Record<string, string | number> = {
      limit: 100,
      offset: 0,
      fields: 'ListingKey,ListPrice,City,StateOrProvince,UnparsedAddress,StreetNumber,StreetName,StreetSuffix,UnitNumber,BedroomsTotal,BathroomsTotalInteger,LivingArea,Media,ListingContractDate'
    }

    // Use bounds if available, otherwise use search query
    if (savedSearch.bounds) {
      filters['Latitude.gte'] = savedSearch.bounds.south
      filters['Latitude.lte'] = savedSearch.bounds.north
      filters['Longitude.gte'] = savedSearch.bounds.west
      filters['Longitude.lte'] = savedSearch.bounds.east
    } else if (savedSearch.searchQuery) {
      filters.near = savedSearch.searchQuery
      filters.radius = 4
    }

    // Add price filters
    if (savedSearch.minPrice) {
      filters['ListPrice.gte'] = savedSearch.minPrice
    }
    if (savedSearch.maxPrice) {
      filters['ListPrice.lte'] = savedSearch.maxPrice
    }

    // Add bedroom filter
    if (savedSearch.minBeds) {
      filters['BedroomsTotal.gte'] = savedSearch.minBeds
    }

    // Add bathroom filter
    if (savedSearch.minBaths) {
      filters['BathroomsTotalInteger.gte'] = savedSearch.minBaths
    }

    // Add property types filter
    const propertyTypes = [...(savedSearch.propertyTypes || [])]
    if (savedSearch.includeLand) {
      propertyTypes.push('Land')
    }
    if (propertyTypes.length > 0) {
      filters['PropertyType.in'] = propertyTypes.join(',')
    }

    // Add status filter
    if (savedSearch.statuses && savedSearch.statuses.length > 0) {
      filters['StandardStatus.in'] = savedSearch.statuses.join(',')
    } else {
      filters['StandardStatus.in'] = 'Active'
    }

    // Filter for new listings with ListingContractDate from previous day
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayFormatted = yesterday.toISOString().split('T')[0] // Format: YYYY-MM-DD
    filters['ListingContractDate'] = yesterdayFormatted

    // Build query string for Bridge API
    const queryString = Object.entries(filters)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&')

    // Make API call directly to Bridge Data Output API
    const apiUrl = `https://api.bridgedataoutput.com/api/v2/iresds/listings?access_token=${process.env.NEXT_PUBLIC_BROWSER_TOKEN}&${queryString}`

    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.error(`Failed to fetch listings: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()
    const listings: Listing[] = data.bundle || []

    // Transform to email format
    return listings.map((listing: Listing): EmailProperty => {
      const address = [
        listing.StreetNumber,
        listing.StreetName,
        listing.StreetSuffix,
        listing.UnitNumber ? `#${listing.UnitNumber}` : ''
      ].filter(Boolean).join(' ') || listing.UnparsedAddress || `${listing.City}, ${listing.StateOrProvince}`

      const imageUrl = listing.Media && listing.Media.length > 0
        ? listing.Media[0].MediaURL
        : undefined

      return {
        id: listing.ListingKey,
        address,
        price: listing.ListPrice,
        beds: listing.BedroomsTotal,
        baths: listing.BathroomsTotalInteger || 0,
        sqft: listing.LivingArea,
        imageUrl,
        listingUrl: `${process.env.NEXTAUTH_URL}/listing/${listing.ListingKey}`
      }
    })
  } catch (error) {
    console.error('Error fetching new listings:', error)
    return []
  }
}