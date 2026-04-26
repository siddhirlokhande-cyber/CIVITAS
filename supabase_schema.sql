-- CIVITAS Database Schema
-- Run this in Supabase SQL Editor to set up all tables

-- Issues Table (for Awaaz portal - civic complaints)
CREATE TABLE IF NOT EXISTS issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  severity VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
  ward VARCHAR(100) NOT NULL,
  reporter_name VARCHAR(255) DEFAULT 'Anonymous',
  deadline TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'Open',
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum Posts Table (for Sabha portal - civic discourse)
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name VARCHAR(255),
  user_handle VARCHAR(255),
  content TEXT NOT NULL,
  tag VARCHAR(100),
  is_official BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  ward VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Officials Table (for Mandaat portal - scoreboard)
CREATE TABLE IF NOT EXISTS officials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  band VARCHAR(50),
  mandaat_score INTEGER DEFAULT 0,
  issues_filed INTEGER DEFAULT 0,
  issues_resolved INTEGER DEFAULT 0,
  trend INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finance Records Table (for Koshagar portal - financial transparency)
CREATE TABLE IF NOT EXISTS finance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department VARCHAR(255) NOT NULL,
  allocated NUMERIC(10, 2),
  spent NUMERIC(10, 2),
  quarter VARCHAR(10),
  fiscal_year VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_ward ON issues(ward);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_ward ON forum_posts(ward);
CREATE INDEX IF NOT EXISTS idx_officials_mandaat_score ON officials(mandaat_score DESC);

-- Enable Row Level Security (RLS) for security
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_records ENABLE ROW LEVEL SECURITY;

-- Create public access policies (for now - allow all reads and writes)
-- WARNING: This is for development. In production, implement proper authentication.

CREATE POLICY "Enable read access for all users" ON issues
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON issues
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON issues
  FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON forum_posts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON forum_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON forum_posts
  FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON officials
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON finance_records
  FOR SELECT USING (true);
