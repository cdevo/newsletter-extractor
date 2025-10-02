export interface NewsletterAd {
  idx: number
  id: number
  created_at: string
  sponsor: string
  ad_text: string
  image_url: string | null
  newsletter_name: string
  sent_date: string
}