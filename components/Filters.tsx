'use client'

import { Filter, X } from 'lucide-react'

interface FiltersProps {
  sponsors: string[]
  newsletters: string[]
  selectedSponsor: string
  selectedNewsletter: string
  onSponsorChange: (sponsor: string) => void
  onNewsletterChange: (newsletter: string) => void
  onReset: () => void
}

export default function Filters({
  sponsors,
  newsletters,
  selectedSponsor,
  selectedNewsletter,
  onSponsorChange,
  onNewsletterChange,
  onReset,
}: FiltersProps) {
  const hasActiveFilters = selectedSponsor || selectedNewsletter

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sponsor" className="block text-sm font-medium text-gray-700 mb-2">
            Sponsor
          </label>
          <select
            id="sponsor"
            value={selectedSponsor}
            onChange={(e) => onSponsorChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Sponsors</option>
            {sponsors.map((sponsor) => (
              <option key={sponsor} value={sponsor}>
                {sponsor}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="newsletter" className="block text-sm font-medium text-gray-700 mb-2">
            Newsletter
          </label>
          <select
            id="newsletter"
            value={selectedNewsletter}
            onChange={(e) => onNewsletterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Newsletters</option>
            {newsletters.map((newsletter) => (
              <option key={newsletter} value={newsletter}>
                {newsletter}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}