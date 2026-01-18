-- Create items table for bizBuddy application
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_level INTEGER NOT NULL DEFAULT 0,
    min_stock_level INTEGER,
    description TEXT,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    supplier VARCHAR(255),
    location VARCHAR(255),
    weight DECIMAL(10,3),
    dimensions VARCHAR(100),
    notes TEXT,
    user_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_name ON items(name);
CREATE INDEX idx_items_sku ON items(sku);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_updated_at 
    BEFORE UPDATE ON items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own items
CREATE POLICY "Users can view their own items" ON items
    FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can insert their own items
CREATE POLICY "Users can insert their own items" ON items
    FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can update their own items
CREATE POLICY "Users can update their own items" ON items
    FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can delete their own items
CREATE POLICY "Users can delete their own items" ON items
    FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Grant permissions to authenticated users
GRANT ALL ON items TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE items_id_seq TO authenticated;