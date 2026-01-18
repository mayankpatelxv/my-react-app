-- Alternative: Items table with simple RLS that works with custom auth
-- This approach uses RLS but with simpler policies

-- If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS items (
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
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
CREATE INDEX IF NOT EXISTS idx_items_sku ON items(sku);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_items_updated_at ON items;
CREATE TRIGGER update_items_updated_at 
    BEFORE UPDATE ON items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable all operations for all users" ON items;

-- Create a simple policy that allows all operations
-- This is less secure but works with custom auth
CREATE POLICY "Enable all operations for all users" ON items
    FOR ALL USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON items TO anon;
GRANT ALL ON items TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE items_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE items_id_seq TO authenticated;