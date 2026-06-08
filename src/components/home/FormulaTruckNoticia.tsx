import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";

interface Participante {
  id: string;
  nome: string;
  pontos: number;
  created_at: string;
}

export default function FormulaTruckNoticia() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParticipantes();
  }, []);

  const loadParticipantes = async () => {
    setLoading(true);
    try {
      // Try to load from Supabase first
      const { data, error } = await supabase
        .from("formula_truck_ranking")
        .select("*")
        .order("pontos", { ascending: false });

      if (!error && data) {
        setParticipantes(data || []);
        localStorage.setItem("formula_truck_backup", JSON.stringify(data));
        setLoading(false);
        return;
      }
    } catch (e) {
      console.log("Supabase not available, using localStorage");
    }

    // Fallback to localStorage
    const saved = localStorage.getItem("formula_truck_backup");
    if (saved) {
      const parsed = JSON.parse(saved);
      setParticipantes(parsed);
    }
    setLoading(false);
  };

  if (loading || participantes.length === 0) {
    return null;
  }

  const sorted = [...participantes].sort((a, b) => b.pontos - a.pontos).slice(0, 3);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Conteúdo */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-gradient-fire" />
              <span className="text-xs font-heading font-bold text-gradient-fire uppercase">NOVIDADE</span>
            </div>
            <h2 className="font-heading text-4xl font-black mb-4">
              Vem aí o 1º Campeonato da <span className="text-gradient-fire">Fórmula Truck</span> na TRG
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Prepare-se para a mais emocionante competição de velocidade! Pilotos da Rocket TRG em uma verdadeira batalha pelo troféu do campeão. 
              Acompanhe o ranking em tempo real e torça para seu favorito!
            </p>
            <div className="flex gap-2">
              <div className="px-4 py-2 rounded-lg bg-gradient-fire/10 border border-gradient-fire/30">
                <p className="text-xs text-muted-foreground">Participantes</p>
                <p className="font-heading text-2xl font-bold text-gradient-fire">{participantes.length}</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-card border border-border">
                <p className="text-xs text-muted-foreground">Campeão</p>
                <p className="font-heading text-lg font-bold text-gradient-fire">{sorted[0]?.nome || "-"}</p>
              </div>
            </div>
          </div>

          {/* Ranking Preview */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h3 className="font-heading text-xl font-bold text-gradient-fire mb-4">TOP 3 DO CAMPEONATO</h3>
            {sorted.map((p, index) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-fire text-primary-foreground font-heading font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm">{p.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {index === 0 && "🥇 Líder"}
                      {index === 1 && "🥈 Segundo"}
                      {index === 2 && "🥉 Terceiro"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-gradient-fire">{p.pontos}</p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
              </div>
            ))}
            {participantes.length > 3 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{participantes.length - 3} participante(s) no ranking completo
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
