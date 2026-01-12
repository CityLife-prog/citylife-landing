-- Fix review ID sequence after migration
-- Migration: 008_fix_review_sequence
-- This resets the sequence to the correct value after data was copied in migration 007

-- Reset the sequence to start from max(id) + 1
SELECT setval(
  pg_get_serial_sequence('reviews', 'id'),
  COALESCE((SELECT MAX(id) FROM reviews), 0) + 1,
  false
);
