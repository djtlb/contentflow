-- ContentFlow Database Schema
-- This file contains the SQL commands to set up the database structure

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create content_submissions table
CREATE TABLE IF NOT EXISTS content_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    original_url TEXT NOT NULL,
    original_title TEXT,
    word_count INTEGER,
    generated_content JSONB,
    status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_subscriptions table for future payment integration
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'creator', 'pro')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_submissions_user_id ON content_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_content_submissions_created_at ON content_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_submissions_status ON content_submissions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);

-- Enable Row Level Security (RLS)
ALTER TABLE content_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for content_submissions
CREATE POLICY "Users can view their own content submissions" ON content_submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content submissions" ON content_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content submissions" ON content_submissions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content submissions" ON content_submissions
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscription" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_content_submissions_updated_at 
    BEFORE UPDATE ON content_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON user_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default subscription for new users (trigger function)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_subscriptions (user_id, plan_type, status)
    VALUES (NEW.id, 'free', 'active');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically create subscription for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create a view for user statistics (optional, for analytics)
CREATE OR REPLACE VIEW user_content_stats AS
SELECT 
    u.id as user_id,
    u.email,
    us.plan_type,
    us.status as subscription_status,
    COUNT(cs.id) as total_submissions,
    COUNT(CASE WHEN cs.created_at >= date_trunc('month', CURRENT_DATE) THEN 1 END) as monthly_submissions,
    COUNT(CASE WHEN cs.status = 'completed' THEN 1 END) as completed_submissions,
    MAX(cs.created_at) as last_submission_date
FROM auth.users u
LEFT JOIN user_subscriptions us ON u.id = us.user_id
LEFT JOIN content_submissions cs ON u.id = cs.user_id
GROUP BY u.id, u.email, us.plan_type, us.status;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON content_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_subscriptions TO authenticated;
GRANT SELECT ON user_content_stats TO authenticated;
