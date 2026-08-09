-- Remove legacy public INSERT policies from the inquiries table.
-- Keep only the policy used by the service-role key path (which bypasses RLS entirely).
-- Run this in Supabase SQL Editor.

-- Drop the two old policies that allowed anon INSERT directly from the browser:
DROP POLICY IF EXISTS "Enable insert for all" ON public.inquiries;
DROP POLICY IF EXISTS "allow_public_insert_inquiries" ON public.inquiries;

-- The anon_insert_inquiries policy can also be removed now that all writes
-- go through the API (service_role key bypasses RLS, so no anon policy is needed).
DROP POLICY IF EXISTS "anon_insert_inquiries" ON public.inquiries;

-- Revoke INSERT from the anon role so the client can no longer write directly
-- even if someone figures out the anon key.
REVOKE INSERT ON public.inquiries FROM anon;

-- Verify: should show only SELECT/UPDATE/DELETE policies (or none) for anon.
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'inquiries'
ORDER BY cmd, policyname;
