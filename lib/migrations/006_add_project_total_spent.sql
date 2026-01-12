-- Add total_spent column to projects table
-- Migration: 006_add_project_total_spent
-- This field tracks the actual amount spent by the client on the project

ALTER TABLE projects ADD COLUMN IF NOT EXISTS total_spent INTEGER DEFAULT 0;

-- Create index for performance when querying by total_spent
CREATE INDEX IF NOT EXISTS idx_projects_total_spent ON projects(total_spent);

-- Add helpful comment
COMMENT ON COLUMN projects.total_spent IS 'Actual amount spent by client in dollars (use budget for estimated/quoted amount)';
