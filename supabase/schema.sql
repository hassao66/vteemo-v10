-- Database schema for vteemo

-- Profiles Table
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Videos Table
CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT REFERENCES profiles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    video_id INT REFERENCES videos(id),
    user_id INT REFERENCES profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallets Table
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES profiles(id),
    balance NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    wallet_id INT REFERENCES wallets(id),
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions Table
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES profiles(id),
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(20) NOT NULL
);

-- Live Streams Table
CREATE TABLE live_streams (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES profiles(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Video Interactions Table
CREATE TABLE video_interactions (
    id SERIAL PRIMARY KEY,
    video_id INT REFERENCES videos(id),
    user_id INT REFERENCES profiles(id),
    interaction_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_policy ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Indexes
CREATE INDEX idx_video_user ON videos (user_id);
CREATE INDEX idx_comment_video ON comments (video_id);
CREATE INDEX idx_wallet_user ON wallets (user_id);

-- Triggers
CREATE FUNCTION update_balance() RETURNS TRIGGER AS $$
BEGIN
    -- Logic to update wallet balance
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER balance_update_trigger
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_balance();
