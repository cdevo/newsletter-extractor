import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test basic connection
    const { data: tables, error: tablesError } = await supabase.rpc('get_tables')

    // Try to fetch from newsletter_details
    const { data, error, count } = await supabase
      .from('newsletter_details')
      .select('*', { count: 'exact' })
      .limit(1)

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        details: error
      })
    }

    res.status(200).json({
      success: true,
      count,
      sampleData: data,
      message: 'Connection successful'
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      details: err
    })
  }
}