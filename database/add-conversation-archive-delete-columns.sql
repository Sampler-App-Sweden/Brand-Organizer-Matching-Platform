-- Add archive and delete-related columns to conversations table
-- This enables archive and delete functionality for conversations

-- Add columns if they don't exist
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS read_only BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES auth.users;

-- Create index for better query performance when filtering archived conversations
CREATE INDEX IF NOT EXISTS idx_conversations_archived ON conversations(archived);

-- Add comment for documentation
COMMENT ON COLUMN conversations.archived IS 'Indicates if the conversation has been archived';
COMMENT ON COLUMN conversations.read_only IS 'When true, prevents new messages from being sent';
COMMENT ON COLUMN conversations.archived_at IS 'Timestamp when the conversation was archived';
COMMENT ON COLUMN conversations.archived_by IS 'User ID who archived the conversation';
