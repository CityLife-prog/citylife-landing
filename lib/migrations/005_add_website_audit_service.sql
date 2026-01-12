-- Migration: 005_add_website_audit_service
-- Add Website Audit & Updates service as first one-time project service

-- Only insert if it doesn't already exist (check by title)
INSERT INTO services (title, description, who_for, features, disclaimer, price, category, hardware_included, sort_order, is_active)
SELECT
  'Website Audit & Updates',
  'Professional review and improvements for existing websites. We analyze performance, security, SEO, and user experience, then provide actionable recommendations or implement fixes directly.',
  'Businesses with existing websites that need optimization, security updates, or performance improvements.',
  '["Comprehensive site audit (performance, security, SEO)", "Page speed optimization", "Mobile responsiveness fixes", "Security vulnerability assessment", "Content and design updates", "Code quality review and improvements"]'::jsonb,
  'Audit pricing includes detailed report and recommendations. Implementation of fixes quoted separately based on scope.',
  'Starting at $300',
  'project',
  FALSE,
  0,
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE title = 'Website Audit & Updates'
);

-- Update sort order for existing project services to push them down
UPDATE services
SET sort_order = sort_order + 1
WHERE category = 'project' AND sort_order >= 0 AND title != 'Website Audit & Updates';
