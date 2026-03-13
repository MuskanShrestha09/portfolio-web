-- Performance Optimization: Adding Indices
-- Run this to optimize sorting performance for projects and logos

CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logos_created_at ON logos(created_at DESC);
