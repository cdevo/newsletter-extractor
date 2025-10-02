import { NewsletterAd } from '@/lib/types'
import { format } from 'date-fns'
import { Calendar, Building2, Mail } from 'lucide-react'

interface AdCardProps {
  ad: NewsletterAd
}

export default function AdCard({ ad }: AdCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-900/10 overflow-hidden hover:shadow-xl hover:border-gray-900/20 transition-all duration-200">
      {ad.image_url && (
        <div className="aspect-video w-full overflow-hidden bg-gray-100">
          <img
            src={ad.image_url}
            alt={`${ad.sponsor} ad`}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            {ad.sponsor}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            ID: {ad.id}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="font-medium">{ad.newsletter_name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(ad.sent_date), 'MMM dd, yyyy - h:mm a')}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {ad.ad_text}
          </p>
        </div>
      </div>
    </div>
  )
}