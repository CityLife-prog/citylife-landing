# Review System Integration Guide

This guide explains how to manage reviews and integrate with external review platforms like Yelp, Google, Facebook, and others.

## Overview

The review system now supports:
- **Direct reviews**: Manually added from admin panel
- **Project linking**: Associate reviews with specific projects
- **External sources**: Track reviews from Yelp, Google, Facebook, etc.
- **Featured reviews**: Highlight your best testimonials
- **Verification**: Mark reviews as verified
- **Source tracking**: Link back to original review platforms

## Database Schema

Reviews now have these fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Unique identifier |
| `client_name` | TEXT | Reviewer's name |
| `client_title` | TEXT | Reviewer's job title |
| `client_company` | TEXT | Reviewer's company |
| `rating` | INTEGER | 1-5 star rating |
| `review_text` | TEXT | Review content |
| `project_name` | TEXT | Associated project name (legacy) |
| `project_id` | INTEGER | Foreign key to projects table |
| `source` | TEXT | Review source: 'direct', 'yelp', 'google', 'facebook', etc. |
| `source_url` | TEXT | Link to original review |
| `verified` | BOOLEAN | Whether review is verified |
| `featured` | BOOLEAN | Display in featured section |
| `image_url` | TEXT | Reviewer's avatar |
| `is_active` | BOOLEAN | Whether to display review |
| `sort_order` | INTEGER | Display order |

## Adding Reviews Manually

### Via Admin Panel (Future Feature)

Coming soon: Admin interface to add reviews directly.

### Via API

```javascript
// POST /api/reviews
{
  "clientName": "John Doe",
  "clientTitle": "CEO",
  "clientCompany": "Acme Corp",
  "rating": 5,
  "reviewText": "Excellent work! Highly recommended.",
  "projectId": 1,
  "source": "direct",
  "verified": true,
  "featured": true
}
```

## External Platform Integration

### Current Status: Manual Import

Currently, reviews from external platforms need to be manually added. Here's how:

1. **Gather reviews** from your platforms
2. **Add via admin panel** or API with proper attribution
3. **Include source URL** to link back to original

### Future: Automated Integration

You can integrate with these platforms using their APIs:

#### 1. Yelp Fusion API

**Setup:**
```bash
# Get API key from https://www.yelp.com/developers
YELP_API_KEY=your-api-key-here
YELP_BUSINESS_ID=your-business-id
```

**Example Integration:**
```typescript
// lib/integrations/yelp.ts
export async function fetchYelpReviews() {
  const response = await fetch(
    `https://api.yelp.com/v3/businesses/${process.env.YELP_BUSINESS_ID}/reviews`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`
      }
    }
  );

  const data = await response.json();

  return data.reviews.map(review => ({
    clientName: review.user.name,
    clientTitle: '',
    clientCompany: '',
    rating: review.rating,
    reviewText: review.text,
    source: 'yelp',
    sourceUrl: review.url,
    imageUrl: review.user.image_url,
    verified: true
  }));
}
```

**Limitations:**
- Max 3 reviews per API call
- Requires business owner verification
- Reviews refresh every 24 hours

#### 2. Google Business Profile API

**Setup:**
```bash
# Get credentials from https://console.cloud.google.com
GOOGLE_PLACE_ID=your-place-id
GOOGLE_MAPS_API_KEY=your-api-key
```

**Example Integration:**
```typescript
// lib/integrations/google.ts
export async function fetchGoogleReviews() {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process.env.GOOGLE_PLACE_ID}&fields=reviews&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );

  const data = await response.json();

  return data.result.reviews.map(review => ({
    clientName: review.author_name,
    clientTitle: '',
    clientCompany: '',
    rating: review.rating,
    reviewText: review.text,
    source: 'google',
    sourceUrl: review.author_url,
    imageUrl: review.profile_photo_url,
    verified: true
  }));
}
```

**Limitations:**
- Max 5 most helpful reviews
- Requires Google Business Profile setup
- Rate limits apply

#### 3. Facebook Recommendations API

**Setup:**
```bash
# Get from https://developers.facebook.com
FACEBOOK_PAGE_ID=your-page-id
FACEBOOK_ACCESS_TOKEN=your-access-token
```

**Example Integration:**
```typescript
// lib/integrations/facebook.ts
export async function fetchFacebookReviews() {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}/ratings?access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`
  );

  const data = await response.json();

  return data.data.map(rating => ({
    clientName: rating.reviewer.name,
    clientTitle: '',
    clientCompany: '',
    rating: rating.rating,
    reviewText: rating.review_text || '',
    source: 'facebook',
    sourceUrl: `https://www.facebook.com/${process.env.FACEBOOK_PAGE_ID}/reviews`,
    imageUrl: rating.reviewer.picture?.data?.url,
    verified: true
  }));
}
```

#### 4. Trustpilot API

**Setup:**
```bash
# Get from https://businessapp.b2b.trustpilot.com
TRUSTPILOT_API_KEY=your-api-key
TRUSTPILOT_BUSINESS_ID=your-business-id
```

**Example Integration:**
```typescript
// lib/integrations/trustpilot.ts
export async function fetchTrustpilotReviews() {
  const response = await fetch(
    `https://api.trustpilot.com/v1/business-units/${process.env.TRUSTPILOT_BUSINESS_ID}/reviews`,
    {
      headers: {
        'apikey': process.env.TRUSTPILOT_API_KEY
      }
    }
  );

  const data = await response.json();

  return data.reviews.map(review => ({
    clientName: review.consumer.displayName,
    clientTitle: '',
    clientCompany: '',
    rating: review.stars,
    reviewText: review.text,
    source: 'trustpilot',
    sourceUrl: `https://www.trustpilot.com/review/${process.env.TRUSTPILOT_BUSINESS_ID}`,
    verified: true
  }));
}
```

## Automated Import Script

Create a scheduled job to import reviews:

```typescript
// scripts/import-reviews.ts
import { db } from '../lib/database';
import { fetchYelpReviews } from '../lib/integrations/yelp';
import { fetchGoogleReviews } from '../lib/integrations/google';

async function importReviews() {
  try {
    // Fetch from all platforms
    const yelpReviews = await fetchYelpReviews();
    const googleReviews = await fetchGoogleReviews();

    const allReviews = [...yelpReviews, ...googleReviews];

    // Import to database
    for (const review of allReviews) {
      // Check if review already exists by source_url
      const existing = db.prepare(
        'SELECT id FROM reviews WHERE source_url = ?'
      ).get(review.sourceUrl);

      if (!existing) {
        db.createReview(review);
        console.log(`Imported review from ${review.source}: ${review.clientName}`);
      }
    }

    console.log(`Successfully imported ${allReviews.length} reviews`);
  } catch (error) {
    console.error('Error importing reviews:', error);
  }
}

// Run import
importReviews();
```

## Scheduled Updates with Cron

Add to your deployment environment:

```bash
# Run every day at 2 AM
0 2 * * * node scripts/import-reviews.js
```

Or use Vercel Cron Jobs in `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/import-reviews",
    "schedule": "0 2 * * *"
  }]
}
```

## Best Practices

### 1. Review Moderation
- Set `is_active = false` for new imports initially
- Review and approve before displaying publicly
- Check for inappropriate content

### 2. Attribution
- Always include `source` field
- Link back to original review with `source_url`
- Display source badge on frontend

### 3. De-duplication
- Check `source_url` before importing
- Compare review text for manual entries
- Use review ID from platform when available

### 4. Rate Limiting
- Respect API rate limits for each platform
- Cache reviews locally (daily refresh is sufficient)
- Use exponential backoff for retries

### 5. Data Privacy
- Don't store sensitive user information
- Follow GDPR/CCPA guidelines
- Allow reviewers to request removal

## Displaying Reviews

### By Project
```typescript
const projectReviews = db.getReviewsByProject(projectId);
```

### Featured Only
```typescript
const featuredReviews = db.getFeaturedReviews();
```

### By Source
```typescript
const yelpReviews = db.getReviewsBySource('yelp');
```

## Implementation Roadmap

### Phase 1: ✅ Current
- [x] Database schema with project linking
- [x] Manual review entry
- [x] Source tracking

### Phase 2: Next Steps
- [ ] Admin UI for review management
- [ ] Manual import from CSV
- [ ] Project assignment interface

### Phase 3: Future
- [ ] Yelp API integration
- [ ] Google Reviews API integration
- [ ] Facebook Recommendations integration
- [ ] Automated daily sync
- [ ] Review response system
- [ ] Analytics dashboard

## Support & Resources

- **Yelp API**: https://www.yelp.com/developers/documentation
- **Google Places API**: https://developers.google.com/maps/documentation/places/web-service/reviews
- **Facebook Graph API**: https://developers.facebook.com/docs/graph-api
- **Trustpilot API**: https://developers.trustpilot.com/

## Questions?

The review system is ready to use! Start by adding reviews manually through the admin panel, and when you're ready, we can implement automated imports from your preferred platforms.
