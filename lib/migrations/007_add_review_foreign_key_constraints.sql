-- Add foreign key constraints to reviews table
-- Migration: 007_add_review_foreign_key_constraints
-- This ensures data integrity: reviews must belong to valid projects

-- Drop the existing reviews table and recreate with proper foreign key constraints
-- Note: This preserves existing data by using a temporary table approach

-- Step 1: Create a new table with proper foreign key constraint
CREATE TABLE IF NOT EXISTS reviews_new (
  id SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_title TEXT NOT NULL,
  client_company TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  project_name TEXT,
  image_url TEXT DEFAULT '/api/placeholder/80/80',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'direct',
  source_url TEXT,
  verified BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Copy data from old table to new table (only if reviews table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reviews') THEN
    INSERT INTO reviews_new
    SELECT * FROM reviews;
  END IF;
END $$;

-- Step 3: Drop old table
DROP TABLE IF EXISTS reviews;

-- Step 4: Rename new table to reviews
ALTER TABLE reviews_new RENAME TO reviews;

-- Step 5: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_active ON reviews(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(featured);

-- Add helpful comments
COMMENT ON TABLE reviews IS 'Client reviews and testimonials, linked to projects for data integrity';
COMMENT ON COLUMN reviews.project_id IS 'Foreign key to projects table - reviews must belong to a project';
