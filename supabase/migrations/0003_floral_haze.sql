/*
  # Add new columns to leads table
  
  1. New Columns
    - company_address (text)
    - company_linkedin (text)
    - company_email (text)
    - company_email_2 (text)
    - company_facebook (text)
    - company_instagram (text)
    - company_twitter (text)
    - company_phone (text)
    - company_phone_2 (text)
    - last_updated (timestamptz)
    
  2. Security
    - Update RLS policies to allow updates
*/

-- Add new columns
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_address text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_linkedin text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_email text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_email_2 text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_facebook text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_instagram text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_twitter text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_phone text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_phone_2 text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_updated timestamptz DEFAULT now();

-- Add update policy
CREATE POLICY "Users can update own leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add trigger to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_leads_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_last_updated
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_last_updated();