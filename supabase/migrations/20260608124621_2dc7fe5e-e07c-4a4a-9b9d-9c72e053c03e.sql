
-- HERO SLIDES
CREATE TABLE public.hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  subtitle_fr TEXT,
  subtitle_en TEXT,
  image_url TEXT,
  cta_label_fr TEXT,
  cta_label_en TEXT,
  cta_href TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero_slides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_slides TO authenticated;
GRANT ALL ON public.hero_slides TO service_role;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hero public read" ON public.hero_slides FOR SELECT USING (published = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage hero" ON public.hero_slides FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- TEAM MEMBERS
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role_fr TEXT,
  role_en TEXT,
  bio_fr TEXT,
  bio_en TEXT,
  photo_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team public read" ON public.team_members FOR SELECT USING (published = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage team" ON public.team_members FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- SITE CONTENT (bilingual key/value)
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  label TEXT,
  value_fr TEXT,
  value_en TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site content public read" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins manage site content" ON public.site_content FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_hero_updated BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_team_updated BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed hero slides
INSERT INTO public.hero_slides (title_fr, title_en, subtitle_fr, subtitle_en, image_url, cta_label_fr, cta_label_en, cta_href, sort_order) VALUES
('Programmes d''éducation et de sensibilisation à la santé', 'Education and Health Awareness Programs', 'Centre communautaire de santé et nutrition à Makebuko, Gitega.', 'Community Health & Nutrition Center in Makebuko, Gitega.', 'https://agakura.bi/visite.jpg', 'Découvrir nos projets', 'Discover our projects', '/projects', 1),
('Autonomisation des jeunes', 'Youth Empowerment', 'Formation professionnelle et entrepreneuriat pour une résilience durable.', 'Vocational training and entrepreneurship for long-term resilience.', 'https://agakura.bi/champs.jpg', 'Nos programmes', 'Our programs', '/projects', 2),
('Inclusion des femmes & environnement', 'Women''s Inclusion & Environment', 'Activités génératrices de revenus et restauration écologique.', 'Income-generating activities and ecological restoration.', 'https://agakura.bi/travaux.jpg', 'En savoir plus', 'Learn more', '/about', 3);

-- Seed team
INSERT INTO public.team_members (name, role_fr, role_en, sort_order) VALUES
('Jean-Marie N.', 'Directeur exécutif', 'Executive Director', 1),
('Claudine M.', 'Coordinatrice programmes', 'Programs Coordinator', 2),
('Patrick K.', 'Responsable jeunesse', 'Youth Officer', 3),
('Élise B.', 'Inclusion des femmes', 'Women''s Inclusion Lead', 4),
('Désiré H.', 'Environnement', 'Environment Lead', 5),
('Sandrine I.', 'Santé communautaire', 'Community Health', 6);

-- Seed site_content
INSERT INTO public.site_content (key, label, value_fr, value_en) VALUES
('about.title', 'About title', 'À propos d''AGAKURA', 'About AGAKURA'),
('about.body', 'About body', 'Depuis 1995, AGAKURA Jeunesse Providence œuvre à Makebuko (Gitega) pour le développement communautaire, l''autonomisation des jeunes et l''inclusion des femmes au Burundi.', 'Since 1995, AGAKURA Jeunesse Providence has worked in Makebuko (Gitega) for community development, youth empowerment and women''s inclusion in Burundi.'),
('about.mission', 'Mission', 'Bâtir une jeunesse autonome, des familles en bonne santé et des communautés résilientes.', 'Build self-reliant youth, healthy families and resilient communities.'),
('about.vision', 'Vision', 'Un Burundi rural où chaque jeune et chaque femme accède aux opportunités économiques et à la santé.', 'A rural Burundi where every young person and woman has access to economic opportunities and health.'),
('about.values', 'Values', 'Intégrité, solidarité, transparence, durabilité et respect des bénéficiaires.', 'Integrity, solidarity, transparency, sustainability and respect for beneficiaries.'),
('contact.phone', 'Phone', '(+257) 61 869 718', '(+257) 61 869 718'),
('contact.email', 'Email', 'contact@agakura.bi', 'contact@agakura.bi'),
('contact.address', 'Address', 'Makebuko, Gitega, Burundi', 'Makebuko, Gitega, Burundi');
