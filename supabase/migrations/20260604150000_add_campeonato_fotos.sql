-- Create campeonato_fotos table
CREATE TABLE IF NOT EXISTS public.campeonato_fotos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  imagem_url text NOT NULL,
  status text NOT NULL DEFAULT 'ativo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.campeonato_fotos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campeonato fotos viewable by everyone" ON public.campeonato_fotos FOR SELECT TO public USING (true);
CREATE POLICY "Auth insert campeonato_fotos" ON public.campeonato_fotos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update campeonato_fotos" ON public.campeonato_fotos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete campeonato_fotos" ON public.campeonato_fotos FOR DELETE TO authenticated USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_campeonato_fotos_updated_at
  BEFORE UPDATE ON public.campeonato_fotos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add storage bucket for campeonato
INSERT INTO storage.buckets (id, name, public) VALUES ('campeonato_fotos', 'campeonato_fotos', true) ON CONFLICT DO NOTHING;

-- Storage policies for campeonato_fotos bucket
CREATE POLICY "Public read campeonato_fotos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'campeonato_fotos');
CREATE POLICY "Auth upload campeonato_fotos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'campeonato_fotos');
CREATE POLICY "Auth delete campeonato_fotos storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'campeonato_fotos');
