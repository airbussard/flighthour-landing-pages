-- Create experience_ratings table for user reviews
CREATE TABLE IF NOT EXISTS experience_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id text NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title varchar(100),
  comment text CHECK (char_length(comment) <= 500),
  is_verified_purchase boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  not_helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Ensure one rating per user per experience
  UNIQUE(experience_id, user_id)
);

-- Create index for faster queries
CREATE INDEX idx_experience_ratings_experience_id ON experience_ratings(experience_id);
CREATE INDEX idx_experience_ratings_user_id ON experience_ratings(user_id);
CREATE INDEX idx_experience_ratings_created_at ON experience_ratings(created_at DESC);

-- Create rating_helpful_votes table to track which users found ratings helpful
CREATE TABLE IF NOT EXISTS rating_helpful_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating_id uuid NOT NULL REFERENCES experience_ratings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful boolean NOT NULL,
  created_at timestamptz DEFAULT now(),

  -- One vote per user per rating
  UNIQUE(rating_id, user_id)
);

-- Create index for faster queries
CREATE INDEX idx_rating_helpful_votes_rating_id ON rating_helpful_votes(rating_id);
CREATE INDEX idx_rating_helpful_votes_user_id ON rating_helpful_votes(user_id);

-- Create view for aggregated ratings per experience
CREATE OR REPLACE VIEW experience_rating_summary AS
SELECT
  experience_id,
  COUNT(*) as total_ratings,
  AVG(rating)::numeric(3,2) as average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star_count,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_count,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_count,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_count
FROM experience_ratings
GROUP BY experience_id;

-- Add average_rating and total_ratings columns to experiences table for performance
ALTER TABLE experiences
ADD COLUMN IF NOT EXISTS average_rating numeric(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_ratings integer DEFAULT 0;

-- Create function to update experience rating summary
CREATE OR REPLACE FUNCTION update_experience_rating_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the experience's average rating and total ratings
  UPDATE experiences
  SET
    average_rating = COALESCE((
      SELECT AVG(rating)::numeric(3,2)
      FROM experience_ratings
      WHERE experience_id = COALESCE(NEW.experience_id, OLD.experience_id)
    ), 0),
    total_ratings = COALESCE((
      SELECT COUNT(*)
      FROM experience_ratings
      WHERE experience_id = COALESCE(NEW.experience_id, OLD.experience_id)
    ), 0)
  WHERE id = COALESCE(NEW.experience_id, OLD.experience_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update experience rating summary
CREATE TRIGGER trigger_update_experience_rating_on_insert
AFTER INSERT ON experience_ratings
FOR EACH ROW EXECUTE FUNCTION update_experience_rating_summary();

CREATE TRIGGER trigger_update_experience_rating_on_update
AFTER UPDATE ON experience_ratings
FOR EACH ROW EXECUTE FUNCTION update_experience_rating_summary();

CREATE TRIGGER trigger_update_experience_rating_on_delete
AFTER DELETE ON experience_ratings
FOR EACH ROW EXECUTE FUNCTION update_experience_rating_summary();

-- Create function to update helpful counts
CREATE OR REPLACE FUNCTION update_rating_helpful_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the rating's helpful and not helpful counts
  UPDATE experience_ratings
  SET
    helpful_count = (
      SELECT COUNT(*)
      FROM rating_helpful_votes
      WHERE rating_id = COALESCE(NEW.rating_id, OLD.rating_id) AND is_helpful = true
    ),
    not_helpful_count = (
      SELECT COUNT(*)
      FROM rating_helpful_votes
      WHERE rating_id = COALESCE(NEW.rating_id, OLD.rating_id) AND is_helpful = false
    )
  WHERE id = COALESCE(NEW.rating_id, OLD.rating_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for helpful votes
CREATE TRIGGER trigger_update_helpful_on_insert
AFTER INSERT ON rating_helpful_votes
FOR EACH ROW EXECUTE FUNCTION update_rating_helpful_counts();

CREATE TRIGGER trigger_update_helpful_on_update
AFTER UPDATE ON rating_helpful_votes
FOR EACH ROW EXECUTE FUNCTION update_rating_helpful_counts();

CREATE TRIGGER trigger_update_helpful_on_delete
AFTER DELETE ON rating_helpful_votes
FOR EACH ROW EXECUTE FUNCTION update_rating_helpful_counts();

-- Row Level Security
ALTER TABLE experience_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rating_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Policies for experience_ratings
-- Anyone can read ratings
CREATE POLICY "Ratings are viewable by everyone" ON experience_ratings
FOR SELECT USING (true);

-- Users can only insert their own ratings
CREATE POLICY "Users can insert own ratings" ON experience_ratings
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings" ON experience_ratings
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings" ON experience_ratings
FOR DELETE USING (auth.uid() = user_id);

-- Policies for rating_helpful_votes
-- Anyone can read votes
CREATE POLICY "Helpful votes are viewable by everyone" ON rating_helpful_votes
FOR SELECT USING (true);

-- Users can only vote with their own user_id
CREATE POLICY "Users can insert own votes" ON rating_helpful_votes
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own votes
CREATE POLICY "Users can update own votes" ON rating_helpful_votes
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete own votes" ON rating_helpful_votes
FOR DELETE USING (auth.uid() = user_id);