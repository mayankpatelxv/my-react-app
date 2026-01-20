-- Create purchases table for storing purchase/bill data
-- This version matches your existing table structure patterns

CREATE TABLE IF NOT EXISTS purchases (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  supplier_id UUID NULL, -- References parties(id) but without foreign key constraint for now
  bill_number TEXT NOT NULL,
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'paid', 'cancelled')),
  payment_terms TEXT,
  notes TEXT,
  attached_document TEXT, -- Store file path/name if document is uploaded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase_items table for storing individual line items
CREATE TABLE IF NOT EXISTS purchase_items (
  id BIGSERIAL PRIMARY KEY,
  purchase_id BIGINT NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  item_id BIGINT NULL, -- References items(id) but without foreign key constraint for now
  item_name TEXT NOT NULL,
  item_description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  line_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_bill_number ON purchases(bill_number);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier_id ON purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase_id ON purchase_items(purchase_id);
CREATE INDEX IF NOT EXISTS idx_purchase_items_item_id ON purchase_items(item_id);

-- Create function to generate bill numbers
CREATE OR REPLACE FUNCTION generate_bill_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  bill_num TEXT;
BEGIN
  -- Get the next bill number (simple sequential numbering)
  SELECT COALESCE(MAX(CAST(SUBSTRING(bill_number FROM 'BILL-(\d+)') AS INTEGER)), 0) + 1
  INTO next_number
  FROM purchases
  WHERE bill_number ~ '^BILL-\d+$';
  
  -- Format as BILL-000001
  bill_num := 'BILL-' || LPAD(next_number::TEXT, 6, '0');
  
  RETURN bill_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate bill numbers
CREATE OR REPLACE FUNCTION set_bill_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.bill_number IS NULL OR NEW.bill_number = '' THEN
    NEW.bill_number := generate_bill_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_bill_number ON purchases;
CREATE TRIGGER trigger_set_bill_number
  BEFORE INSERT ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION set_bill_number();

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_purchases_updated_at ON purchases;
CREATE TRIGGER trigger_update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Disable Row Level Security (to match your existing tables pattern)
ALTER TABLE purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items DISABLE ROW LEVEL SECURITY;

-- Grant permissions to all users (anon and authenticated)
GRANT ALL ON purchases TO anon;
GRANT ALL ON purchases TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE purchases_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE purchases_id_seq TO authenticated;

GRANT ALL ON purchase_items TO anon;
GRANT ALL ON purchase_items TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE purchase_items_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE purchase_items_id_seq TO authenticated;