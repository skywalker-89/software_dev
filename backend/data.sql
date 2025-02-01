CREATE TABLE lost_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id INT REFERENCES users(id) ON DELETE SET NULL,
    image_urls TEXT[] NOT NULL, -- Array to store multiple images
    description TEXT NOT NULL,
    last_seen_location TEXT NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    status TEXT CHECK (status IN ('lost', 'claimed')) DEFAULT 'lost',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE found_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    founder_id INT REFERENCES users(id) ON DELETE SET NULL,
    image_urls TEXT[] NOT NULL, -- Array to store multiple images
    description TEXT NOT NULL,
    found_location TEXT NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    status TEXT CHECK (status IN ('found', 'claimed')) DEFAULT 'found',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
