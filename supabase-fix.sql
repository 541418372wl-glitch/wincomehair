-- ============================================================
-- WINCOME — Supabase 安全与字段修复脚本
-- 执行方式：Supabase Dashboard → SQL Editor → 粘贴执行
-- 执行前：建议在 SQL Editor 里先备份（无需备份，均为可回滚操作）
-- ============================================================

-- 1) 为新增表单字段补充数据列（Target Market / Expected Lead Time）
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS target_market text;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS timeline text;

-- 2) 删除 inquiries 表上所有 SELECT / UPDATE / DELETE / ALL 策略
--    （这些策略可能允许任意 authenticated 用户读取全部询盘）
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'inquiries'
      AND cmd IN ('SELECT', 'UPDATE', 'DELETE', 'ALL')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.inquiries', p.policyname);
    RAISE NOTICE 'Dropped policy: %', p.policyname;
  END LOOP;
END $$;

-- 3) 收紧表级权限：
--    anon（匿名前端表单）→ 只允许 INSERT
--    authenticated → 撤销全部直接权限（网站无登录用户，后台统一走 service_role）
--    service_role → 保留全部权限（Supabase 内部/后台读取，绕过 RLS）
REVOKE ALL ON public.inquiries FROM anon, authenticated;
GRANT INSERT ON public.inquiries TO anon;
GRANT ALL ON public.inquiries TO service_role;

-- 4) 重建唯一必要的 anon INSERT 策略（前端表单写入用）
DROP POLICY IF EXISTS "anon_insert_inquiries" ON public.inquiries;
CREATE POLICY "anon_insert_inquiries" ON public.inquiries
  FOR INSERT TO anon
  WITH CHECK (true);

-- 5) 确认 RLS 处于启用状态（应已启用，此处幂等）
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 额外手动步骤（Dashboard 操作，SQL 无法覆盖）：
--
-- A. 关闭公开注册（如无客户登录功能，必须做）：
--    Dashboard → Authentication → Providers → Email →
--    关闭 "Allow new users to sign up"
--
-- B. （可选）验证当前策略清单：
--    SELECT schemaname, tablename, policyname, cmd, roles
--    FROM pg_policies WHERE tablename = 'inquiries';
--    应只剩 anon_insert_inquiries 一条 INSERT 策略
-- ============================================================
