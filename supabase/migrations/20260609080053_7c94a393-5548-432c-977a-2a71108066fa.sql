
CREATE TABLE public.page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  country text,
  user_agent text,
  referrer text,
  visited_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.page_visits TO authenticated;
GRANT ALL ON public.page_visits TO service_role;

ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view visits"
  ON public.page_visits FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE INDEX page_visits_visited_at_idx ON public.page_visits (visited_at DESC);
CREATE INDEX page_visits_country_idx ON public.page_visits (country);
