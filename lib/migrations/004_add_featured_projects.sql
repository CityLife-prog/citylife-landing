-- CityLyfe Database Schema for Postgres
-- Migration: 004_add_featured_projects
-- Add featured project fields for landing page display

-- Add featured fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured, featured_order);

-- Add comment
COMMENT ON COLUMN projects.featured IS 'Whether this project should be displayed on the landing page';
COMMENT ON COLUMN projects.featured_order IS 'Display order for featured projects (1-3, lower = higher priority)';
