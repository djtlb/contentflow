-- Create promotions table for admin promotional campaigns
CREATE TABLE IF NOT EXISTS promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    active BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0
);

-- Create index for active promotions
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active, expires_at);

-- Create index for created_by
CREATE INDEX IF NOT EXISTS idx_promotions_created_by ON promotions(created_by);

-- Enable Row Level Security
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can manage promotions
CREATE POLICY "Admin can manage promotions" ON promotions
    FOR ALL USING (
        auth.email() IN (
            'admin@contentflow.com',
            'sallykamari61@gmail.com'  -- Admin access for Sally
        )
    );

-- Policy: All authenticated users can view active promotions
CREATE POLICY "Users can view active promotions" ON promotions
    FOR SELECT USING (
        active = true AND 
        (expires_at IS NULL OR expires_at > NOW()) AND
        auth.role() = 'authenticated'
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_promotions_updated_at 
    BEFORE UPDATE ON promotions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to get active promotions for users
CREATE OR REPLACE FUNCTION get_active_promotions()
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.message,
        p.type,
        p.created_at
    FROM promotions p
    WHERE p.active = true 
    AND (p.expires_at IS NULL OR p.expires_at > NOW())
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_promo_view_count(promo_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE promotions 
    SET view_count = view_count + 1 
    WHERE id = promo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_promo_click_count(promo_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE promotions 
    SET click_count = click_count + 1 
    WHERE id = promo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
