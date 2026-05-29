-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- User profiles synced with next-auth
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Domain search history
CREATE TABLE IF NOT EXISTS searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL,
  available BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Saved / watched domains
CREATE TABLE IF NOT EXISTS saved_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, domain)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_domains ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own data
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own searches" ON searches;
CREATE POLICY "Users can view own searches"
  ON searches FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own searches" ON searches;
CREATE POLICY "Users can insert own searches"
  ON searches FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own saved domains" ON saved_domains;
CREATE POLICY "Users can view own saved domains"
  ON saved_domains FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own saved domains" ON saved_domains;
CREATE POLICY "Users can insert own saved domains"
  ON saved_domains FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved domains" ON saved_domains;
CREATE POLICY "Users can delete own saved domains"
  ON saved_domains FOR DELETE USING (auth.uid() = user_id);

-- Stripe subscription columns (run this separately if table already exists)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_plan TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS stripe_status TEXT DEFAULT 'inactive';
