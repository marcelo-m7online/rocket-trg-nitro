import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function CampeonatoFotos() {
  const [campeonatos, setCampeonatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const { data, error } = await supabase
          .from("campeonato_fotos")
          .select("*")
          .eq("status", "ativo")
          .order("created_at", { ascending: false });
        
        if (!error && data) {
          setCampeonatos(data || []);
          localStorage.setItem("campeonato_fotos_backup", JSON.stringify(data));
        } else {
          throw error;
        }
      } catch (error) {
        console.error("Erro ao carregar campeonatos:", error);
        // Fallback to localStorage
        const saved = localStorage.getItem("campeonato_fotos_backup");
        if (saved) {
          const parsed = JSON.parse(saved);
          const filtered = parsed.filter((p: any) => !p.status || p.status === "ativo");
          setCampeonatos(filtered);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCampeonatos();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground">Carregando campeonatos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!campeonatos || campeonatos.length === 0) {
    return (
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-black text-gradient-fire mb-2">
              1º CAMPEONATO DE FOTOS
            </h2>
            <div className="w-24 h-1 bg-gradient-fire rounded mb-6"></div>
            <p className="text-muted-foreground font-display text-sm">
              Nenhum campeonato ativo no momento. Cadastre novas fotos no painel administrativo para que elas apareçam aqui!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-black text-gradient-fire mb-2">
            1º CAMPEONATO DE FOTOS
          </h2>
          <div className="w-24 h-1 bg-gradient-fire rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campeonatos.map((campeonato) => (
            <div key={campeonato.id} className="rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all group">
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={campeonato.imagem_url}
                  alt={campeonato.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 bg-card/50 backdrop-blur-sm">
                <h3 className="font-heading text-lg font-bold text-gradient-fire mb-2">
                  {campeonato.titulo}
                </h3>
                {campeonato.descricao && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {campeonato.descricao}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
