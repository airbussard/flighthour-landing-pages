-- ==========================================
-- EVENTHOUR DATABASE SETUP FOR SUPABASE
-- ==========================================
-- Dieses Script erstellt alle notwendigen Tabellen für das Eventhour-System
-- Führe es in der Supabase SQL Editor aus

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================== ENUMS ====================

-- User Role Enum
CREATE TYPE user_role AS ENUM ('ADMIN', 'PARTNER', 'CUSTOMER');

-- Verification Status Enum
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- Additional Service Type Enum
CREATE TYPE additional_service_type AS ENUM ('PHYSICAL_PRODUCT', 'DIGITAL_SERVICE', 'PACKAGING');

-- Payment Status Enum
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- Order Status Enum
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- Order Item Type Enum
CREATE TYPE order_item_type AS ENUM ('EXPERIENCE', 'VALUE_VOUCHER');

-- Voucher Type Enum
CREATE TYPE voucher_type AS ENUM ('EXPERIENCE', 'VALUE');

-- Voucher Status Enum
CREATE TYPE voucher_status AS ENUM ('ACTIVE', 'REDEEMED', 'EXPIRED', 'CANCELLED');

-- Payout Status Enum
CREATE TYPE payout_status AS ENUM ('PENDING', 'APPROVED', 'PAID', 'REJECTED');

-- ==================== TABLES ====================

-- Users Table (verknüpft mit Supabase Auth)
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role user_role DEFAULT 'CUSTOMER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Profiles Table
CREATE TABLE customer_profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone TEXT,
    birthday DATE,
    default_postal_code TEXT,
    preferences JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners Table
CREATE TABLE partners (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Company Data
    company_name TEXT NOT NULL,
    legal_form TEXT,
    trade_register_number TEXT,
    tax_id TEXT,
    vat_id TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    
    -- Business Address
    business_street TEXT NOT NULL,
    business_number TEXT NOT NULL,
    business_city TEXT NOT NULL,
    business_postal_code TEXT NOT NULL,
    business_country TEXT DEFAULT 'DE',
    
    -- Billing Address
    billing_street TEXT,
    billing_number TEXT,
    billing_city TEXT,
    billing_postal_code TEXT,
    billing_country TEXT,
    use_business_address_for_billing BOOLEAN DEFAULT TRUE,
    
    -- Bank Details
    bank_name TEXT,
    iban TEXT,
    bic TEXT,
    account_holder_name TEXT,
    bank_verified BOOLEAN DEFAULT FALSE,
    
    -- Contact Person
    contact_person_name TEXT,
    contact_person_email TEXT,
    contact_person_phone TEXT,
    contact_person_position TEXT,
    
    -- Business Terms
    commission_rate DECIMAL(5,2) DEFAULT 0.70,
    payment_terms TEXT DEFAULT '30 Tage',
    contract_start_date DATE,
    contract_end_date DATE,
    
    -- System
    is_active BOOLEAN DEFAULT TRUE,
    verification_status verification_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

-- Categories Table
CREATE TABLE categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    parent_category_id TEXT REFERENCES categories(id),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences Table
CREATE TABLE experiences (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    
    -- Location & Geo
    location_name TEXT NOT NULL,
    street TEXT,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'DE',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Business Logic
    duration INT NOT NULL, -- Minutes
    max_participants INT,
    partner_id TEXT NOT NULL REFERENCES partners(id),
    category_id TEXT REFERENCES categories(id),
    
    -- Pricing (in Cents)
    retail_price INT NOT NULL,
    tax_rate DECIMAL(5,4) DEFAULT 0.19,
    partner_payout INT NOT NULL,
    
    -- Search & Discovery
    search_keywords TEXT,
    popularity_score INT DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience Images Table
CREATE TABLE experience_images (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    experience_id TEXT NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Additional Services Table
CREATE TABLE additional_services (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    price INT NOT NULL, -- Cents
    tax_rate DECIMAL(5,4) DEFAULT 0.19,
    service_type additional_service_type NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_number TEXT UNIQUE NOT NULL,
    customer_user_id TEXT REFERENCES users(id),
    
    -- Pricing (in Cents)
    subtotal INT NOT NULL,
    tax_amount INT NOT NULL,
    total_amount INT NOT NULL,
    
    -- Payment
    payment_intent_id TEXT,
    payment_status payment_status DEFAULT 'PENDING',
    payment_method TEXT,
    
    -- Customer Data
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    
    -- Status
    status order_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Order Items Table
CREATE TABLE order_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_type order_item_type NOT NULL,
    
    -- Experience Items
    experience_id TEXT REFERENCES experiences(id),
    
    -- Value Voucher Items
    voucher_value INT, -- Cents
    
    -- Common
    quantity INT DEFAULT 1,
    unit_price INT NOT NULL, -- Cents
    tax_rate DECIMAL(5,4) NOT NULL
);

-- Order Additional Services Table
CREATE TABLE order_additional_services (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    additional_service_id TEXT NOT NULL REFERENCES additional_services(id),
    quantity INT DEFAULT 1,
    unit_price INT NOT NULL -- Cents
);

-- Vouchers Table
CREATE TABLE vouchers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    voucher_code TEXT UNIQUE NOT NULL,
    voucher_type voucher_type NOT NULL,
    
    -- Experience Vouchers
    experience_id TEXT REFERENCES experiences(id),
    
    -- Value Vouchers (in Cents)
    voucher_value INT,
    remaining_value INT,
    
    -- Customer Data
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    order_id TEXT REFERENCES orders(id),
    
    -- Validity
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Redemption
    redeemed_at TIMESTAMPTZ,
    redeemed_by_partner_id TEXT REFERENCES partners(id),
    redemption_notes TEXT,
    
    -- Tax
    tax_rate DECIMAL(5,4) DEFAULT 0.19,
    
    -- Status
    status voucher_status DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voucher Downloads Table
CREATE TABLE voucher_downloads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    voucher_id TEXT NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
    customer_user_id TEXT REFERENCES users(id),
    downloaded_at TIMESTAMPTZ DEFAULT NOW(),
    download_count INT DEFAULT 1,
    ip_address TEXT
);

-- Partner Payouts Table
CREATE TABLE partner_payouts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    partner_id TEXT NOT NULL REFERENCES partners(id),
    voucher_id TEXT NOT NULL REFERENCES vouchers(id),
    amount INT NOT NULL, -- Cents
    status payout_status DEFAULT 'PENDING',
    
    -- Timestamps
    claimed_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Favorites Table
CREATE TABLE customer_favorites (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experience_id TEXT NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(customer_user_id, experience_id)
);

-- Experience Views Table
CREATE TABLE experience_views (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    experience_id TEXT NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    user_id TEXT,
    ip_address TEXT NOT NULL,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search Logs Table
CREATE TABLE search_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    query TEXT NOT NULL,
    location TEXT,
    user_id TEXT,
    results_count INT NOT NULL,
    clicked_experience_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cookie Consents Table (DSGVO)
CREATE TABLE cookie_consents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT,
    session_id TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    
    -- Consent Details
    essential BOOLEAN DEFAULT TRUE,
    analytics BOOLEAN DEFAULT FALSE,
    marketing BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    given_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- DSGVO Compliance
    consent_version TEXT NOT NULL,
    withdrawal_at TIMESTAMPTZ,
    
    UNIQUE(session_id, consent_version)
);

-- Consent Audit Logs Table
CREATE TABLE consent_audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id TEXT NOT NULL,
    action TEXT NOT NULL,
    old_consent JSONB,
    new_consent JSONB NOT NULL,
    ip_address TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Partner indexes
CREATE INDEX idx_partners_verification_status ON partners(verification_status);
CREATE INDEX idx_partners_is_active ON partners(is_active);

-- Experience indexes
CREATE INDEX idx_experiences_partner_id ON experiences(partner_id);
CREATE INDEX idx_experiences_category_id ON experiences(category_id);
CREATE INDEX idx_experiences_is_active ON experiences(is_active);
CREATE INDEX idx_experiences_city ON experiences(city);
CREATE INDEX idx_experiences_popularity ON experiences(popularity_score DESC);

-- Order indexes
CREATE INDEX idx_orders_customer_user_id ON orders(customer_user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Voucher indexes
CREATE INDEX idx_vouchers_voucher_code ON vouchers(voucher_code);
CREATE INDEX idx_vouchers_status ON vouchers(status);
CREATE INDEX idx_vouchers_experience_id ON vouchers(experience_id);
CREATE INDEX idx_vouchers_redeemed_by_partner_id ON vouchers(redeemed_by_partner_id);

-- ==================== TRIGGERS ====================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON customer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_vouchers_updated_at BEFORE UPDATE ON vouchers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==================== INITIAL DATA ====================

-- Create admin user (Password: admin123 - muss über Supabase Auth gesetzt werden)
INSERT INTO users (id, email, name, role) VALUES 
    ('admin-001', 'admin@eventhour.de', 'System Administrator', 'ADMIN');

-- Create test categories
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES 
    ('Abenteuer & Action', 'abenteuer-action', 'Erlebe Adrenalin pur mit unseren Action-Erlebnissen', '🪂', 1),
    ('Wellness & Entspannung', 'wellness-entspannung', 'Gönn dir eine Auszeit vom Alltag', '🧘', 2),
    ('Kulinarik & Genuss', 'kulinarik-genuss', 'Entdecke kulinarische Highlights', '🍷', 3),
    ('Sport & Fitness', 'sport-fitness', 'Bleib aktiv mit unseren Sport-Erlebnissen', '⚽', 4),
    ('Kultur & Kreatives', 'kultur-kreatives', 'Entfalte deine kreative Seite', '🎨', 5),
    ('Reisen & Kurztrips', 'reisen-kurztrips', 'Entdecke neue Orte', '✈️', 6);

-- Create test additional services
INSERT INTO additional_services (name, description, price, service_type) VALUES 
    ('Premium Geschenkverpackung', 'Edle Geschenkbox mit Schleife', 990, 'PACKAGING'),
    ('Express-Versand', 'Lieferung innerhalb von 24 Stunden', 1490, 'DIGITAL_SERVICE'),
    ('Gedruckter Gutschein', 'Hochwertiger Druck auf Premium-Papier', 590, 'PHYSICAL_PRODUCT');

-- ==================== ROW LEVEL SECURITY ====================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (anpassen nach Bedarf)

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id);

-- Admins can do everything
CREATE POLICY "Admins have full access to users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Public can view active experiences
CREATE POLICY "Public can view active experiences" ON experiences
    FOR SELECT USING (is_active = true);

-- Partners can manage their own experiences
CREATE POLICY "Partners can manage own experiences" ON experiences
    FOR ALL USING (
        partner_id IN (
            SELECT id FROM partners 
            WHERE user_id = auth.uid()::text
        )
    );

-- ==================== FUNCTIONS ====================

-- Function to generate unique voucher codes
CREATE OR REPLACE FUNCTION generate_voucher_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := 'EH-';
    i INT;
BEGIN
    FOR i IN 1..12 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        IF i % 4 = 0 AND i < 12 THEN
            result := result || '-';
        END IF;
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- ==================== END OF SETUP ====================

-- Verify installation
SELECT 
    'Eventhour Database Setup Complete!' as message,
    (SELECT COUNT(*) FROM categories) as categories_count,
    (SELECT COUNT(*) FROM users WHERE role = 'ADMIN') as admin_users_count,
    (SELECT COUNT(*) FROM additional_services) as services_count;