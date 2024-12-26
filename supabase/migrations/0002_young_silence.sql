/*
  # Update leads table RLS policies

  1. Changes
    - Add RLS policies for leads table
    - Enable authenticated users to insert and view their own leads
  
  2. Security
    - Enable RLS on leads table
    - Add policies for authenticated users
*/

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can read own leads" ON leads;
DROP POLICY IF EXISTS "Users can insert own leads" ON leads;

-- Create new policies
CREATE POLICY "Users can read own leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add user_id if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE leads ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;