
-- Create recrutamento table
CREATE TABLE public.recrutamento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  nickname text NOT NULL,
  idade integer,
  discord text,
  steam text,
  experiencia text,
  motivacao text,
  vtlog_id text,
  status text NOT NULL DEFAULT 'pendente',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.recrutamento ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a recruitment application (INSERT)
CREATE POLICY "Anyone can submit recruitment" ON public.recrutamento
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only viewable by authenticated (admin will use service role)
CREATE POLICY "Recruitment viewable by authenticated" ON public.recrutamento
  FOR SELECT TO authenticated USING (true);

-- Public can view their own (by matching on some field - not needed, admin only)
-- We'll keep select restricted to authenticated

-- Add updated_at trigger
CREATE TRIGGER update_recrutamento_updated_at
  BEFORE UPDATE ON public.recrutamento
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for gallery and products
INSERT INTO storage.buckets (id, name, public) VALUES ('galeria', 'galeria', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('produtos', 'produtos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true);

-- Storage policies for public read
CREATE POLICY "Public read galeria" ON storage.objects FOR SELECT TO public USING (bucket_id = 'galeria');
CREATE POLICY "Public read produtos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'produtos');
CREATE POLICY "Public read blog" ON storage.objects FOR SELECT TO public USING (bucket_id = 'blog');

-- Authenticated can upload
CREATE POLICY "Auth upload galeria" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'galeria');
CREATE POLICY "Auth upload produtos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'produtos');
CREATE POLICY "Auth upload blog" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog');

-- Authenticated can delete
CREATE POLICY "Auth delete galeria" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'galeria');
CREATE POLICY "Auth delete produtos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'produtos');
CREATE POLICY "Auth delete blog" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'blog');

-- Add INSERT/UPDATE/DELETE policies for admin on all tables (using authenticated)
-- drivers
CREATE POLICY "Auth insert drivers" ON public.drivers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update drivers" ON public.drivers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete drivers" ON public.drivers FOR DELETE TO authenticated USING (true);

-- ranking
CREATE POLICY "Auth insert ranking" ON public.ranking FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update ranking" ON public.ranking FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete ranking" ON public.ranking FOR DELETE TO authenticated USING (true);

-- comboios
CREATE POLICY "Auth insert comboios" ON public.comboios FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update comboios" ON public.comboios FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete comboios" ON public.comboios FOR DELETE TO authenticated USING (true);

-- galeria
CREATE POLICY "Auth insert galeria" ON public.galeria FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update galeria" ON public.galeria FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete galeria" ON public.galeria FOR DELETE TO authenticated USING (true);

-- produtos
CREATE POLICY "Auth insert produtos" ON public.produtos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update produtos" ON public.produtos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete produtos" ON public.produtos FOR DELETE TO authenticated USING (true);

-- blog_posts
CREATE POLICY "Auth insert blog" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update blog" ON public.blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete blog" ON public.blog_posts FOR DELETE TO authenticated USING (true);

-- hall_da_fama
CREATE POLICY "Auth insert hall" ON public.hall_da_fama FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update hall" ON public.hall_da_fama FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete hall" ON public.hall_da_fama FOR DELETE TO authenticated USING (true);

-- Make all select policies permissive (current ones are restrictive)
-- Drop and recreate select policies as permissive
DROP POLICY "Drivers are viewable by everyone" ON public.drivers;
CREATE POLICY "Drivers are viewable by everyone" ON public.drivers FOR SELECT USING (true);

DROP POLICY "Ranking is viewable by everyone" ON public.ranking;
CREATE POLICY "Ranking is viewable by everyone" ON public.ranking FOR SELECT USING (true);

DROP POLICY "Comboios are viewable by everyone" ON public.comboios;
CREATE POLICY "Comboios are viewable by everyone" ON public.comboios FOR SELECT USING (true);

DROP POLICY "Galeria is viewable by everyone" ON public.galeria;
CREATE POLICY "Galeria is viewable by everyone" ON public.galeria FOR SELECT USING (true);

DROP POLICY "Produtos are viewable by everyone" ON public.produtos;
CREATE POLICY "Produtos are viewable by everyone" ON public.produtos FOR SELECT USING (true);

DROP POLICY "Published posts are viewable by everyone" ON public.blog_posts;
CREATE POLICY "Published posts viewable" ON public.blog_posts FOR SELECT USING (publicado = true);
CREATE POLICY "Auth view all posts" ON public.blog_posts FOR SELECT TO authenticated USING (true);

DROP POLICY "Hall da fama is viewable by everyone" ON public.hall_da_fama;
CREATE POLICY "Hall da fama is viewable by everyone" ON public.hall_da_fama FOR SELECT USING (true);
