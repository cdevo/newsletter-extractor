'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { NewsletterAd } from '@/lib/types'
import AdCard from '@/components/AdCard'
import Filters from '@/components/Filters'
import PasswordProtect from '@/components/PasswordProtect'
import { Loader2, AlertCircle, Database } from 'lucide-react'

const ITEMS_PER_PAGE = 20

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [ads, setAds] = useState<NewsletterAd[]>([])
  const [filteredAds, setFilteredAds] = useState<NewsletterAd[]>([])
  const [displayedAds, setDisplayedAds] = useState<NewsletterAd[]>([])
  const [sponsors, setSponsors] = useState<string[]>([])
  const [newsletters, setNewsletters] = useState<string[]>([])
  const [selectedSponsor, setSelectedSponsor] = useState('')
  const [selectedNewsletter, setSelectedNewsletter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  // Check for authentication in sessionStorage
  useEffect(() => {
    const authenticated = sessionStorage.getItem('authenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
    }
    setAuthChecked(true)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchAds()
    }
  }, [isAuthenticated])

  useEffect(() => {
    filterAds()
  }, [ads, selectedSponsor, selectedNewsletter, startDate, endDate])

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1)
    setDisplayedAds(filteredAds.slice(0, ITEMS_PER_PAGE))
    setHasMore(filteredAds.length > ITEMS_PER_PAGE)
  }, [filteredAds])

  // Load more items when page changes
  useEffect(() => {
    if (page > 1) {
      const startIndex = 0
      const endIndex = page * ITEMS_PER_PAGE
      setDisplayedAds(filteredAds.slice(startIndex, endIndex))
      setHasMore(endIndex < filteredAds.length)
    }
  }, [page, filteredAds])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading])

  const fetchAds = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Fetching from newsletter_details table...')

      // First, let's try to get table info
      const { data: tableData, error: tableError } = await supabase
        .from('newsletter_details')
        .select('*', { count: 'exact' })
        .limit(1)

      console.log('Table check:', { tableData, tableError })

      // Fetch all data - need to fetch in batches to get past 1000 row limit
      let allData: any[] = [];
      const pageSize = 1000;
      let currentPage = 0;

      // First get the total count
      const { count: totalCount } = await supabase
        .from('newsletter_details')
        .select('*', { count: 'exact', head: true })

      console.log('Total records in database:', totalCount)

      // Fetch data in batches
      while (currentPage * pageSize < (totalCount || 0)) {
        const from = currentPage * pageSize;
        const to = from + pageSize - 1;

        const { data: batch, error: batchError } = await supabase
          .from('newsletter_details')
          .select('*')
          .order('sent_date', { ascending: false })
          .range(from, to)

        if (batchError) {
          console.error(`Error fetching batch ${currentPage}:`, batchError)
          throw batchError
        }

        if (batch) {
          allData = [...allData, ...batch];
        }

        currentPage++;
      }

      const data = allData;
      const error = null;
      const count = totalCount;

      console.log('Supabase response:', {
        fetchedCount: data?.length,
        totalCount: count,
        error
      })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      if (data) {
        console.log(`Successfully fetched ${data.length} ads out of ${count} total in database`)
        setAds(data)

        const uniqueSponsors = Array.from(new Set(data.map(ad => ad.sponsor))).sort((a, b) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
        const uniqueNewsletters = Array.from(new Set(data.map(ad => ad.newsletter_name))).sort((a, b) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        )

        setSponsors(uniqueSponsors)
        setNewsletters(uniqueNewsletters)
      } else {
        console.log('No data returned from Supabase')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ads')
      console.error('Error fetching ads:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterAds = () => {
    let filtered = [...ads]

    if (selectedSponsor) {
      filtered = filtered.filter(ad => ad.sponsor === selectedSponsor)
    }

    if (selectedNewsletter) {
      filtered = filtered.filter(ad => ad.newsletter_name === selectedNewsletter)
    }

    if (startDate) {
      filtered = filtered.filter(ad => {
        const adDate = new Date(ad.sent_date)
        const filterStartDate = new Date(startDate)
        return adDate >= filterStartDate
      })
    }

    if (endDate) {
      filtered = filtered.filter(ad => {
        const adDate = new Date(ad.sent_date)
        const filterEndDate = new Date(endDate)
        // Set end date to end of day to include the entire day
        filterEndDate.setHours(23, 59, 59, 999)
        return adDate <= filterEndDate
      })
    }

    setFilteredAds(filtered)
  }

  const handleReset = () => {
    setSelectedSponsor('')
    setSelectedNewsletter('')
    setStartDate('')
    setEndDate('')
  }

  const handleAuthenticate = () => {
    sessionStorage.setItem('authenticated', 'true')
    setIsAuthenticated(true)
  }

  // Wait for auth check to complete before showing anything
  if (!authChecked) {
    return null
  }

  // Show password screen if not authenticated
  if (!isAuthenticated) {
    return <PasswordProtect onAuthenticate={handleAuthenticate} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading newsletter ads...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Ads</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAds}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Newsletter Ads Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Browse and filter newsletter advertisements
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://docs.google.com/document/d/1jEj68TC8x322BNhvTUiBtbpxhZUpQQMiM8lZQoZ_jjM/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Feature Request
              </a>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Ads</p>
                <p className="text-2xl font-bold text-gray-900">{ads.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Filters
          sponsors={sponsors}
          newsletters={newsletters}
          selectedSponsor={selectedSponsor}
          selectedNewsletter={selectedNewsletter}
          startDate={startDate}
          endDate={endDate}
          onSponsorChange={setSelectedSponsor}
          onNewsletterChange={setSelectedNewsletter}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onReset={handleReset}
        />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {displayedAds.length} of {filteredAds.length} {filteredAds.length === 1 ? 'ad' : 'ads'}
            {(selectedSponsor || selectedNewsletter || startDate || endDate) && ' (filtered)'}
          </p>
        </div>

        {filteredAds.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No ads found matching your filters.</p>
            <button
              onClick={handleReset}
              className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>

            {/* Intersection Observer target */}
            <div ref={observerTarget} className="h-10 flex items-center justify-center mt-8">
              {hasMore && (
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              )}
            </div>

            {!hasMore && displayedAds.length > 0 && (
              <p className="text-center text-gray-500 text-sm mt-8">
                You've reached the end of the results
              </p>
            )}
          </>
        )}
      </main>
    </div>
  )
}
