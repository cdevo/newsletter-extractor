# Newsletter Dashboard

A Next.js dashboard for browsing and filtering newsletter advertisements from a Supabase database.

## Features

- Browse newsletter ads with sponsor and newsletter filtering
- Responsive grid layout
- Real-time data from Supabase
- Batch fetching for datasets over 1000 records

## Deployment to Vercel

### Prerequisites
- Vercel account
- Supabase project with `newsletter_details` table

### Deploy Steps

1. Push your code to GitHub (if not already)

2. Go to [Vercel](https://vercel.com) and import your repository

3. Configure environment variables in Vercel project settings:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Deploy! Vercel will automatically build and deploy your app

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
```bash
cp .env.example .env.local
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Tech Stack

- Next.js 15.5.4 with Turbopack
- React 19
- Supabase for database
- Tailwind CSS for styling
- TypeScript

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.