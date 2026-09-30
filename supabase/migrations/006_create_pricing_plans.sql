CREATE TABLE
    IF NOT EXISTS public.pricing_plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL CHECK (price >= 0),
        description TEXT NOT NULL,
        cta TEXT NOT NULL,
        popular BOOLEAN NOT NULL DEFAULT false,
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

INSERT INTO
    public.pricing_plans (
        id,
        name,
        price,
        description,
        cta,
        popular,
        sort_order
    )
VALUES
    (
        'starter',
        'Starter',
        5000,
        'For businesses ready to establish a strong digital foundation.',
        'Get Started',
        false,
        0
    ),
    (
        'growth',
        'Growth',
        10000,
        'For ambitious brands ready to scale fast with integrated, multi-channel growth.',
        'Start Growing →',
        true,
        1
    ),
    (
        'scale',
        'Scale',
        17500,
        'Full-service partnership for established brands ready to dominate their market.',
        'Let''s Talk',
        false,
        2
    ) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.pricing_plans
ADD COLUMN IF NOT EXISTS billing_period TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'one-time'));

INSERT INTO
    public.pricing_plans (
        id,
        name,
        price,
        description,
        cta,
        popular,
        sort_order,
        billing_period
    )
VALUES
    (
        'website-build',
        'Website Build',
        5000,
        'One-time project price.',
        'Request a Quote',
        false,
        0,
        'one-time'
    ),
    (
        'brand-identity',
        'Brand Identity',
        6000,
        'One-time project price.',
        'Request a Quote',
        false,
        1,
        'one-time'
    ),
    (
        'shopify-store',
        'Shopify Store',
        7500,
        'One-time project price.',
        'Request a Quote',
        false,
        2,
        'one-time'
    ),
    (
        'crm-setup',
        'CRM Setup',
        4250,
        'One-time project price.',
        'Request a Quote',
        false,
        3,
        'one-time'
    ),
    (
        'seo-audit',
        'SEO Audit',
        2250,
        'One-time project price.',
        'Request a Quote',
        false,
        4,
        'one-time'
    ) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_pricing_plans" ON public.pricing_plans;

CREATE POLICY "public_read_pricing_plans" ON public.pricing_plans FOR
SELECT
    USING (true);

CREATE INDEX IF NOT EXISTS idx_pricing_plans_sort_order ON public.pricing_plans (sort_order);