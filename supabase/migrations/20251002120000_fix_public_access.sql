/*
  # Fix Public Access to Content

  ## Overview
  This migration fixes RLS policies to allow public (unauthenticated) users to view content
  while maintaining security for write operations.

  ## Changes
  1. **Profiles Table**
     - Update SELECT policy to allow public viewing
     - Keep write operations restricted to authenticated users

  2. **Videos Table**
     - Update SELECT policy to allow public viewing of published videos
     - Keep write operations restricted to video owners

  3. **Live Streams Table**
     - Update SELECT policy to allow public viewing
     - Keep write operations restricted to stream owners

  ## Security Notes
  - Public users can only READ content
  - Only authenticated users can create/modify/delete content
  - Users can only modify their own content
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Videos are viewable by everyone" ON videos;
DROP POLICY IF EXISTS "Live streams are viewable by everyone" ON live_streams;
DROP POLICY IF EXISTS "Users can view all subscriptions" ON subscriptions;

-- Create new public-friendly policies for profiles
CREATE POLICY "Public can view all profiles"
  ON profiles FOR SELECT
  TO public
  USING (true);

-- Create new public-friendly policies for videos
CREATE POLICY "Public can view published videos"
  ON videos FOR SELECT
  TO public
  USING (status = 'published');

-- Create new public-friendly policies for live streams
CREATE POLICY "Public can view live streams"
  ON live_streams FOR SELECT
  TO public
  USING (true);

-- Create new public-friendly policies for subscriptions
CREATE POLICY "Public can view subscriptions"
  ON subscriptions FOR SELECT
  TO public
  USING (true);
