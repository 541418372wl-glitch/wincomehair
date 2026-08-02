CREATE TABLE IF NOT EXISTS public.inquiries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  product_type TEXT,
  quantity TEXT,
  material TEXT,
  logo_placement TEXT,
  dimensions TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users only" ON public.inquiries
  FOR SELECT USING (auth.role() = 'authenticated');
