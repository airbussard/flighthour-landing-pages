-- Migration: Rename partner_payout to purchase_price
-- This changes the pricing model to separate retail price (Verkaufspreis) and purchase price (Einkaufspreis)

-- Step 1: Rename the column from partner_payout to purchase_price
ALTER TABLE experiences 
RENAME COLUMN partner_payout TO purchase_price;

-- Step 2: Add a comment to clarify the purpose
COMMENT ON COLUMN experiences.purchase_price IS 'The price paid to the partner (Einkaufspreis) in cents';
COMMENT ON COLUMN experiences.retail_price IS 'The price shown to customers (Verkaufspreis) in cents';

-- Step 3: Update any existing data if needed (optional)
-- The values remain the same, just the column name changes

-- Step 4: Verify the change
-- SELECT id, title, retail_price, purchase_price, (retail_price - purchase_price) as commission 
-- FROM experiences 
-- LIMIT 5;