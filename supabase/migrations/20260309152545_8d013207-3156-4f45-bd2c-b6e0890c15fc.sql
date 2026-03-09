
-- Create timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Drivers table
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  nickname TEXT NOT NULL,
  vtlog_id TEXT,
  km_rodados INTEGER NOT NULL DEFAULT 0,
  viagens INTEGER NOT NULL DEFAULT 0,
  pontos INTEGER NOT NULL DEFAULT 0,
  data_entrada DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'ativo',
  avatar_url TEXT,
  cargo TEXT DEFAULT 'Motorista',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Drivers are viewable by everyone" ON public.drivers FOR SELECT USING (true);

CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON public.drivers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Ranking table
CREATE TABLE public.ranking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  pontos INTEGER NOT NULL DEFAULT 0,
  viagens INTEGER NOT NULL DEFAULT 0,
  km INTEGER NOT NULL DEFAULT 0,
  posicao INTEGER NOT NULL DEFAULT 0,
  periodo TEXT DEFAULT 'mensal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ranking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ranking is viewable by everyone" ON public.ranking FOR SELECT USING (true);

CREATE TRIGGER update_ranking_updated_at
  BEFORE UPDATE ON public.ranking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Comboios table
CREATE TABLE public.comboios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  data TIMESTAMP WITH TIME ZONE NOT NULL,
  rota TEXT NOT NULL,
  mapa TEXT DEFAULT 'RBR',
  descricao TEXT,
  imagem_url TEXT,
  participantes TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'agendado',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.comboios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comboios are viewable by everyone" ON public.comboios FOR SELECT USING (true);

CREATE TRIGGER update_comboios_updated_at
  BEFORE UPDATE ON public.comboios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Galeria table
CREATE TABLE public.galeria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  imagem_url TEXT NOT NULL,
  categoria TEXT DEFAULT 'comboio',
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.galeria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Galeria is viewable by everyone" ON public.galeria FOR SELECT USING (true);

-- Produtos table
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  imagem_url TEXT,
  estoque INTEGER NOT NULL DEFAULT 0,
  categoria TEXT DEFAULT 'geral',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Produtos are viewable by everyone" ON public.produtos FOR SELECT USING (true);

CREATE TRIGGER update_produtos_updated_at
  BEFORE UPDATE ON public.produtos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  autor TEXT NOT NULL,
  data_publicacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  imagem_capa TEXT,
  slug TEXT UNIQUE,
  publicado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are viewable by everyone" ON public.blog_posts FOR SELECT USING (publicado = true);

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Hall da Fama table
CREATE TABLE public.hall_da_fama (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT DEFAULT 'mensal',
  mes_referencia TEXT,
  trofeu TEXT DEFAULT 'ouro',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hall_da_fama ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hall da fama is viewable by everyone" ON public.hall_da_fama FOR SELECT USING (true);
