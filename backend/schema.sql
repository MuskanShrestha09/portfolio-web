-- Full Portfolio Database Schema
-- Run this once on a fresh Cloudflare D1 database

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT DEFAULT '',
    imageUrl TEXT NOT NULL,
    behanceUrl TEXT NOT NULL,
    type TEXT DEFAULT 'design',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imageUrl TEXT NOT NULL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Indices for performance optimization
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logos_created_at ON logos(created_at DESC);

-- Seed initial data with correct values
INSERT OR IGNORE INTO projects (id, title, category, description, imageUrl, behanceUrl) VALUES 
('ibm-school', 'IBM School Program', 'Ad Campaign', 'A comprehensive education initiative for IBM.', '/project-01.jpg', 'https://www.behance.net/work/aabid.design'),
('valley-public', 'Valley Public School', 'Rebranding', 'Modernizing the identity of Valley Public School.', '/project-02.jpg', 'https://www.behance.net/work/aabid.design');

INSERT OR IGNORE INTO site_settings (key, value) VALUES 
('email', 'aabidhasan495@gmail.com'),
('phone', '+977 981 607 1322'),
('whatsapp', '9779816071322'),
('info_bio', 'The most innovative solution to a complex problem is often the simplest one. But as anyone who''s devoted their time to big ideas knows, simple and easy are two very different things. Nowhere is this more true than when designing visual identities.'),
('info_experience', '[{"label": "SENIOR DESIGNER, 2019 — PRESENT", "title": "Alwazebrand — Nepal"}, {"label": "GRAPHIC DESIGNER, 2017 — 2019", "title": "Whiteberry Trading — Qatar"}, {"label": "SENIOR GRAPHIC DESIGNER, 2015 — 2017", "title": "Shop Mates Creation — Nepal"}]');
