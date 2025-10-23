'use client'

import { useState, useMemo } from 'react'
import { Filter, X, Search, Calendar } from 'lucide-react'

interface FiltersProps {
  sponsors: string[]
  newsletters: string[]
  sponsorCounts: Record<string, number>
  newsletterCounts: Record<string, number>
  selectedSponsor: string
  selectedNewsletter: string
  startDate: string
  endDate: string
  onSponsorChange: (sponsor: string) => void
  onNewsletterChange: (newsletter: string) => void
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onReset: () => void
}

export default function Filters({
  sponsors,
  newsletters,
  sponsorCounts,
  newsletterCounts,
  selectedSponsor,
  selectedNewsletter,
  startDate,
  endDate,
  onSponsorChange,
  onNewsletterChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: FiltersProps) {
  const [sponsorSearch, setSponsorSearch] = useState('')
  const [newsletterSearch, setNewsletterSearch] = useState('')
  const hasActiveFilters = selectedSponsor || selectedNewsletter || startDate || endDate

  // Filter sponsors based on search
  const filteredSponsors = useMemo(() => {
    if (!sponsorSearch) return sponsors
    return sponsors.filter(sponsor =>
      sponsor.toLowerCase().includes(sponsorSearch.toLowerCase())
    )
  }, [sponsors, sponsorSearch])

  // Filter newsletters based on search
  const filteredNewsletters = useMemo(() => {
    if (!newsletterSearch) return newsletters
    return newsletters.filter(newsletter =>
      newsletter.toLowerCase().includes(newsletterSearch.toLowerCase())
    )
  }, [newsletters, newsletterSearch])

  const handleReset = () => {
    setSponsorSearch('')
    setNewsletterSearch('')
    onReset()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sponsor" className="block text-sm font-medium text-gray-700 mb-2">
              Sponsor
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sponsors..."
                value={sponsorSearch}
                onChange={(e) => setSponsorSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
              />
            </div>
            <select
              id="sponsor"
              value={selectedSponsor}
              onChange={(e) => onSponsorChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="">All Sponsors ({filteredSponsors.length})</option>
              {filteredSponsors.map((sponsor) => (
                <option key={sponsor} value={sponsor}>
                  {sponsor} ({sponsorCounts[sponsor] || 0})
                </option>
              ))}
            </select>
            {sponsorSearch && filteredSponsors.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">No sponsors found</p>
            )}
            {sponsorSearch && filteredSponsors.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Showing {filteredSponsors.length} of {sponsors.length}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="newsletter" className="block text-sm font-medium text-gray-700 mb-2">
              Newsletter
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search newsletters..."
                value={newsletterSearch}
                onChange={(e) => setNewsletterSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
              />
            </div>
            <select
              id="newsletter"
              value={selectedNewsletter}
              onChange={(e) => onNewsletterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="">All Newsletters ({filteredNewsletters.length})</option>
              {filteredNewsletters.map((newsletter) => (
                <option key={newsletter} value={newsletter}>
                  {newsletter} ({newsletterCounts[newsletter] || 0})
                </option>
              ))}
            </select>
            {newsletterSearch && filteredNewsletters.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">No newsletters found</p>
            )}
            {newsletterSearch && filteredNewsletters.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Showing {filteredNewsletters.length} of {newsletters.length}
              </p>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-xs text-gray-600 mb-1">
                From
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-xs text-gray-600 mb-1">
                To
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}