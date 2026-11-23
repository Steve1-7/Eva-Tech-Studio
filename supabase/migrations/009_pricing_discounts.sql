ALTER TABLE public.pricing_plans
ADD COLUMN IF NOT EXISTS discount_percent INTEGER NOT NULL DEFAULT 40
CHECK (discount_percent BETWEEN 0 AND 100);

