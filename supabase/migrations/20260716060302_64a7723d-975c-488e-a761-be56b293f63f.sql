ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS program_slug TEXT;
CREATE INDEX IF NOT EXISTS projects_program_slug_idx ON public.projects(program_slug);