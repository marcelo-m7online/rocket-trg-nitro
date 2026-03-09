
-- Add bio and truck photo to drivers
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS avatar_url_caminhao text;

-- Add descricao to galeria
ALTER TABLE public.galeria ADD COLUMN IF NOT EXISTS descricao text;

-- Create caminhoes table
CREATE TABLE IF NOT EXISTS public.caminhoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  marca text,
  modelo text,
  ano text,
  placa text,
  driver_id uuid REFERENCES public.drivers(id) ON DELETE SET NULL,
  imagem_url text,
  descricao text,
  status text NOT NULL DEFAULT 'ativo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.caminhoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Caminhoes viewable by everyone" ON public.caminhoes FOR SELECT TO public USING (true);
CREATE POLICY "Auth insert caminhoes" ON public.caminhoes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update caminhoes" ON public.caminhoes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete caminhoes" ON public.caminhoes FOR DELETE TO authenticated USING (true);

-- Create lives table
CREATE TABLE IF NOT EXISTS public.lives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  plataforma text NOT NULL DEFAULT 'twitch',
  url text NOT NULL,
  streamer text NOT NULL,
  ativa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lives viewable by everyone" ON public.lives FOR SELECT TO public USING (true);
CREATE POLICY "Auth insert lives" ON public.lives FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update lives" ON public.lives FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete lives" ON public.lives FOR DELETE TO authenticated USING (true);

-- Add RLS for update/delete on recrutamento for authenticated
CREATE POLICY "Auth update recrutamento" ON public.recrutamento FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete recrutamento" ON public.recrutamento FOR DELETE TO authenticated USING (true);

-- Storage buckets for drivers and caminhoes
INSERT INTO storage.buckets (id, name, public) VALUES ('drivers', 'drivers', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('caminhoes', 'caminhoes', true) ON CONFLICT DO NOTHING;

-- Storage policies for drivers bucket
CREATE POLICY "Public read drivers" ON storage.objects FOR SELECT TO public USING (bucket_id = 'drivers');
CREATE POLICY "Auth upload drivers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'drivers');
CREATE POLICY "Auth delete drivers storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'drivers');

-- Storage policies for caminhoes bucket
CREATE POLICY "Public read caminhoes" ON storage.objects FOR SELECT TO public USING (bucket_id = 'caminhoes');
CREATE POLICY "Auth upload caminhoes" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'caminhoes');
CREATE POLICY "Auth delete caminhoes storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'caminhoes');
