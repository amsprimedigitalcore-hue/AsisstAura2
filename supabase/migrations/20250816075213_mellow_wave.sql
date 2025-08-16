/*
  # Create chatbot system tables

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `service` (text)
      - `additional_message` (text, optional)
      - `chat_history` (jsonb, stores chat messages)
      - `created_at` (timestamp)
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access to leads (for chatbot)
    - Add policies for authenticated admin access
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  additional_message text,
  chat_history jsonb DEFAULT '[]'::jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for leads table (allow public insert and select for chatbot)
CREATE POLICY "Allow public insert on leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public select on leads"
  ON leads
  FOR SELECT
  TO anon
  USING (true);

-- Create policies for admin_users table (allow authenticated select)
CREATE POLICY "Allow admin select on admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);