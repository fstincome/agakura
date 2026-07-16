
-- Add a gallery column for extra images per program
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}'::text[];

-- Replace existing projects with the 3 official programs
DELETE FROM public.projects;

INSERT INTO public.projects (slug, title_fr, title_en, category_fr, category_en, excerpt_fr, excerpt_en, body_fr, body_en, image_url, gallery_urls, published, sort_order) VALUES
(
  'ferme-ecole',
  'Ferme-école',
  'Farm School',
  'Formation des jeunes',
  'Youth training',
  'Ferme-école pour la formation professionnelle des jeunes en agriculture, élevage et pratiques durables — cycle 2025-2026.',
  'A farm school offering vocational training to young people in agriculture, animal husbandry and sustainable practices — 2025-2026 cohort.',
  E'La Ferme-école accompagne chaque année une nouvelle promotion de jeunes apprenants dans des filières concrètes : cultures vivrières, maraîchage, élevage de poules et bonnes pratiques agricoles. Les cycles se concluent par une remise de certificats reconnue localement.',
  E'The Farm School trains a new cohort of young learners each year in practical fields: food crops, market gardening, poultry farming and sound agricultural practices. Each cycle ends with a locally recognised certificate ceremony.',
  '/__l5e/assets-v1/0beb08ec-f464-47bb-b4c4-4c213156cd70/formation-agriculture.jpg',
  ARRAY[
    '/__l5e/assets-v1/f4fb0683-acf5-4b77-8985-6994e678ba85/debut-formation.jpg',
    '/__l5e/assets-v1/c63156f9-c574-4297-8b11-80716ac2e776/apprenants.jpg',
    '/__l5e/assets-v1/85753a55-8aa7-48bf-b8c6-5268bb42ffa6/elevage-poule.jpg',
    '/__l5e/assets-v1/5f7ae412-1552-4f66-b436-d69037f1bde1/remise-certificats.jpg'
  ],
  true,
  1
),
(
  'cesaco',
  'CESACO',
  'CESACO',
  'Santé communautaire & nutrition',
  'Community health & nutrition',
  'Centre de santé communautaire et nutritionnel en faveur des femmes, des enfants vulnérables et de leurs ménages d''origine.',
  'A community health and nutrition centre supporting women, vulnerable children and their households.',
  E'Le CESACO combine soins de santé de proximité, appui nutritionnel et sensibilisation. Un jardin potager alimente le centre de santé et permet aux femmes bénéficiaires d''acquérir des compétences en agriculture nutritive.',
  E'CESACO combines local healthcare, nutritional support and community awareness. A vegetable garden feeds the health centre and helps women beneficiaries build nutritious-farming skills.',
  '/__l5e/assets-v1/44a5b2d0-0f17-45aa-8653-169c628646c7/jardin-potager.jpg',
  ARRAY[
    '/__l5e/assets-v1/30c209ef-7ae9-4182-9a11-9fd2a16e8710/sensibilisation.jpg',
    '/__l5e/assets-v1/e4f2db36-8e50-4a25-ab71-d3e001d7016d/planification-locale.jpg'
  ],
  true,
  2
),
(
  'biodiversite-resilience-climatique',
  'Biodiversité & Résilience climatique',
  'Biodiversity & Climate Resilience',
  'Environnement',
  'Environment',
  'Régénération naturelle assistée, sensibilisation et distribution de matériel pour renforcer la résilience climatique des communautés.',
  'Assisted natural regeneration, awareness and equipment distribution to strengthen community climate resilience.',
  E'Le programme protège la biodiversité locale à travers des sites de régénération naturelle assistée (RNA), la mobilisation communautaire et la distribution d''outils de terrain aux ménages engagés dans la restauration de leur environnement.',
  E'The programme protects local biodiversity through assisted natural regeneration (ANR) sites, community mobilisation and the distribution of field tools to households restoring their environment.',
  '/__l5e/assets-v1/52eb0631-42d0-42dd-bff0-acd776011c23/site-rna.jpg',
  ARRAY[
    '/__l5e/assets-v1/17c98b86-77aa-4586-8a41-c5be766cfb5f/distribution-materiel.jpg'
  ],
  true,
  3
);
