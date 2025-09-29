-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own wishlist" ON wishlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist" ON wishlist
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist" ON wishlist
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);
CREATE INDEX idx_wishlist_created_at ON wishlist(created_at DESC);