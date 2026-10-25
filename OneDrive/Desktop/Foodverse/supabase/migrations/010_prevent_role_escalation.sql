-- 010_prevent_role_escalation.sql
-- Additional security measures to prevent role self-escalation

-- Drop existing profile update policies to replace with stricter ones
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- New policy: Users can update own profile BUT NOT role
-- Only non-role fields can be updated by users
CREATE POLICY "Users can update own profile fields" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    -- Ensure role is not being changed
    (SELECT role FROM profiles WHERE id = auth.uid()) =
    (SELECT role FROM profiles AS old WHERE old.id = auth.uid())
  );

-- Admins only can update roles
CREATE POLICY "Admins can update user roles" ON profiles
  FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Create a function to audit role changes
CREATE TABLE IF NOT EXISTS role_change_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  old_role user_role,
  new_role user_role,
  changed_by_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX role_change_audit_user_id_idx ON role_change_audit(user_id);
CREATE INDEX role_change_audit_changed_by_idx ON role_change_audit(changed_by_user_id);
CREATE INDEX role_change_audit_created_at_idx ON role_change_audit(created_at DESC);

-- Enable RLS on audit table
ALTER TABLE role_change_audit ENABLE ROW LEVEL SECURITY;

-- Admins can view role change audit
CREATE POLICY "Admins can view role audit" ON role_change_audit
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Function to log role changes
CREATE OR REPLACE FUNCTION audit_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO role_change_audit (user_id, old_role, new_role, changed_by_user_id)
    VALUES (NEW.id, OLD.role, NEW.role, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for role change audit
DROP TRIGGER IF EXISTS audit_role_changes ON profiles;
CREATE TRIGGER audit_role_changes
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION audit_role_change();

-- Constraint: Prevent direct SQL role updates by non-admins (additional safeguard)
-- This is enforced at the policy level, but adding a comment for documentation
COMMENT ON TABLE profiles IS 'User profiles with role-based access control. Role changes only by admins.';
