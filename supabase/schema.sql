-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Steve Zulu',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  cover_image TEXT,
  category TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  meta_description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id BIGSERIAL PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- AI Reports Table (for storing generated audits and quotes)
CREATE TABLE IF NOT EXISTS ai_reports (
  id BIGSERIAL PRIMARY KEY,
  report_type TEXT NOT NULL, -- 'audit', 'quote', 'custom'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  business_name TEXT,
  business_description TEXT,
  user_email TEXT,
  user_ip TEXT,
  model_used TEXT DEFAULT 'gemini-pro', -- Which AI model generated this
  tokens_used INTEGER, -- For cost tracking
  fallback_used BOOLEAN DEFAULT false, -- If this was a fallback response
  metadata JSONB, -- Additional data (services, tier, goals, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days') -- Auto-delete after 30 days
);

-- Disable RLS on tables for server-side operations
ALTER TABLE IF EXISTS admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_reports DISABLE ROW LEVEL SECURITY;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_ai_reports_type ON ai_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_ai_reports_created ON ai_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_reports_expires ON ai_reports(expires_at);
CREATE INDEX IF NOT EXISTS idx_ai_reports_email ON ai_reports(user_email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for blog_posts (drop if exists first)
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
