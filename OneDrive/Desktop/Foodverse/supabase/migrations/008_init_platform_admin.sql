-- 008_init_platform_admin.sql
-- Platform settings, support FAQs, and related tables

CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_fee_base_pkr DECIMAL(10, 2) DEFAULT 150.00,
  delivery_fee_per_km DECIMAL(10, 2) DEFAULT 10.00,
  min_order_value_pkr DECIMAL(10, 2) DEFAULT 500.00,
  commission_percentage DECIMAL(5, 2) DEFAULT 15.00,
  support_email TEXT,
  support_phone TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO platform_settings (id) VALUES (gen_random_uuid());

CREATE TABLE support_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  intent TEXT,
  keywords TEXT[],
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX support_faqs_intent_idx ON support_faqs(intent);
CREATE INDEX support_faqs_is_active_idx ON support_faqs(is_active);

-- Create updated_at trigger for support_faqs
CREATE OR REPLACE FUNCTION update_support_faqs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER support_faqs_updated_at_trigger
  BEFORE UPDATE ON support_faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_support_faqs_updated_at();

-- Support conversations (optional persistence)
CREATE TABLE support_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX support_conversations_user_id_idx ON support_conversations(user_id);
CREATE INDEX support_conversations_is_resolved_idx ON support_conversations(is_resolved);

-- Enable RLS
ALTER TABLE support_conversations ENABLE ROW LEVEL SECURITY;

-- Support messages
CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES support_conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL,
  message_text TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX support_messages_conversation_id_idx ON support_messages(conversation_id);

-- Enable RLS
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
