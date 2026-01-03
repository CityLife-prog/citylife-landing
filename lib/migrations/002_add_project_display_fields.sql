-- Add display fields to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_title TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS technologies TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS key_results TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Web Development';
