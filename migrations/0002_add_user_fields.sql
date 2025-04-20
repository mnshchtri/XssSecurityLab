-- Add email and bio fields to users table
ALTER TABLE users
ADD COLUMN email text UNIQUE,
ADD COLUMN bio text;

-- Update existing users with placeholder values
UPDATE users
SET email = username || '@example.com',
    bio = 'No bio yet'
WHERE email IS NULL; 