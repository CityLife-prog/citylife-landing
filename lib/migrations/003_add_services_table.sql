-- CityLyfe Database Schema for Postgres
-- Migration: 003_add_services_table
-- Add services table with hardware_included checkbox

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  who_for TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  disclaimer TEXT,
  price TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('project', 'monthly')),
  hardware_included BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert existing services from the codebase
INSERT INTO services (id, title, description, who_for, features, disclaimer, price, category, hardware_included, sort_order)
VALUES
  -- Project-Based Services
  (
    1,
    'Custom Web Development',
    'Professional, responsive websites built for performance, security, and scalability.',
    'Businesses, contractors, startups, and organizations that need a strong online presence or improvements to an existing site.',
    '["Modern, mobile-first website design", "Performance-optimized builds", "Secure deployment and configuration", "SEO-ready site structure"]'::jsonb,
    'CityLyfe is not limited to a single framework or platform. While we frequently work with modern tools such as React and Next.js, we also work with websites already deployed on the web, support other frameworks, CMS platforms, and custom stacks, and can improve, refactor, or extend existing sites without requiring full rebuilds.',
    'Starting at $800',
    'project',
    FALSE,
    1
  ),
  (
    2,
    'Local Smart Home Integration',
    'Smart home setup and automation focused on reliability, security, and ease of use.',
    'Homeowners, rental properties, and small offices looking to integrate smart technology locally.',
    '["Smart lighting and automation", "Security camera and monitoring setup", "Climate control systems", "Voice assistant configuration"]'::jsonb,
    'All hardware and devices are purchased by the client unless explicitly stated otherwise in the signed contract. CityLyfe provides professional recommendations, installation, and configuration services.',
    'Starting at $100',
    'project',
    FALSE,
    2
  ),
  (
    3,
    'Business Automation',
    'Custom automation solutions that reduce manual work, improve accuracy, and streamline operations.',
    'Businesses relying on repetitive tasks, spreadsheets, manual data entry, or disconnected systems.',
    '["Workflow automation", "Email and notification systems", "Data processing and validation", "API and third-party integrations"]'::jsonb,
    NULL,
    'Starting at $500',
    'project',
    FALSE,
    3
  ),
  (
    4,
    'Mobile App Development',
    'Custom mobile applications designed for usability, performance, and long-term growth.',
    'Startups, internal business tools, and customer-facing mobile applications.',
    '["iOS and Android support", "Cross-platform development", "App store submission assistance", "Analytics and usage tracking"]'::jsonb,
    NULL,
    'Starting at $2,000',
    'project',
    FALSE,
    4
  ),

  -- Monthly Services
  (
    5,
    'SEO & Website Visibility',
    'Search engine optimization focused on technical best practices, performance, and long-term visibility.',
    'Businesses that want to improve search presence, local visibility, and website performance over time.',
    '["Technical SEO monitoring", "Page speed and performance optimization", "Mobile usability improvements", "Metadata updates (titles, descriptions, structured data)", "Google Search Console setup and monitoring", "Google Business Profile optimization", "Monthly performance summaries"]'::jsonb,
    'Search engine optimization results vary by industry and competition. Specific rankings, traffic levels, and conversions cannot be guaranteed.',
    'Starting at $300/month',
    'monthly',
    FALSE,
    5
  ),
  (
    6,
    'Ongoing Support & Maintenance',
    'Proactive support to keep websites and systems secure, updated, and running smoothly.',
    'Clients who want peace of mind after launch and priority support when changes or issues arise.',
    '["Bug fixes and issue resolution", "Security patches and updates", "Performance monitoring", "Content and minor updates"]'::jsonb,
    NULL,
    'Starting at $50/month',
    'monthly',
    FALSE,
    6
  ),
  (
    7,
    'Cloud & Hosting Solutions',
    'Secure, scalable hosting and infrastructure management without the complexity of managing servers.',
    'Businesses that want reliable hosting and monitoring without handling infrastructure themselves.',
    '["Domain and DNS configuration", "SSL certificates", "CDN and performance optimization", "Monitoring and backups"]'::jsonb,
    NULL,
    'Starting at $25/month',
    'monthly',
    FALSE,
    7
  )
ON CONFLICT (id) DO NOTHING;

-- Reset sequence to continue from highest ID
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);
