-- Migration: 009_link_reviews_to_projects
-- Link existing reviews to their projects based on project_name

-- Update reviews with matching project names
UPDATE reviews r
SET project_id = p.id
FROM projects p
WHERE r.project_name = p.name
  AND r.project_id IS NULL;

-- Log results
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'Updated % reviews with project_id', updated_count;
END $$;
