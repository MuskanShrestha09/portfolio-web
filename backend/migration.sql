-- Migration to add Description to Projects
ALTER TABLE projects ADD COLUMN description TEXT DEFAULT '';

-- Table for Client Logos (above footer)
CREATE TABLE IF NOT EXISTS logos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imageUrl TEXT NOT NULL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for Site-wide Settings (Info, Contact, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Seed initial settings
INSERT OR IGNORE INTO site_settings (key, value) VALUES 
('email', 'aabidhasan495@gmail.com'),
('phone', '+977 981 607 1322'),
('whatsapp', '9779816071322'),
('info_bio', 'The most innovative solution to a complex problem is often the simplest one. But as anyone who''s devoted their time to big ideas knows, simple and easy are two very different things. Nowhere is this more true than when designing visual identities.'),
('info_experience', '[{"label": "SENIOR DESIGNER, 2019 — PRESENT", "title": "Alwazebrand — Nepal"}, {"label": "GRAPHIC DESIGNER, 2017 — 2019", "title": "Whiteberry Trading — Qatar"}, {"label": "SENIOR GRAPHIC DESIGNER, 2015 — 2017", "title": "Shop Mates Creation — Nepal"}]');
