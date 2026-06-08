import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchVtlogRanking } from "@/integrations/vtlog/client";

const positionIcons = [Trophy, Medal, Award];
const positionColors = ["text-gold", "text-muted-foreground", "text-fire-orange"];

export default function QuickRanking() {
  const { data: topDrivers, isLoading } = useQuery({
    queryKey: ["vtlog-top-drivers"],
    queryFn: async () => {
      const data = await fetchVtlogRanking();
      // Pegar apenas os 5 primeiros para o Quick Ranking da Home
      return data.slice(0, 5);
    },
    // Cache de 5 minutos para evitar bater limites da API ao navegar
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gradient-fire mb-2">
            TOP MOTORISTAS
          </h2>
          <p className="text-muted-foreground font-display">Os melhores pilotos da nossa frota</p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {isLoading && (
            <div className="text-center text-muted-foreground font-display py-8 animate-pulse">
              Carregando dados da VTLOG...
            </div>
          )}

          {!isLoading && (topDrivers || []).map((driver, i) => {
            const Icon = positionIcons[Math.min(i, 2)];
            const color = positionColors[Math.min(i, 2)];
            return (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                <span className="font-heading text-2xl font-bold text-muted-foreground w-8">
                  #{i + 1}
                </span>
                {i < 3 ? (
                  <Icon className={`h-6 w-6 ${color}`} />
                ) : (
                  <div className="w-6 h-6" /> // spacer for alignment
                )}

                {driver.avatar ? (
                  <img src={driver.avatar} alt={driver.nickname} className="w-10 h-10 rounded-full border border-border/50 object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-muted-foreground">
                    {driver.nickname.charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-display font-bold text-foreground">{driver.nickname}</p>
                  <p className="text-xs text-muted-foreground">{driver.nome}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-lg font-bold text-primary">
                    {driver.pontos.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-muted-foreground">exp</p>
                </div>
              </motion.div>
            );
          })}

          {!isLoading && (!topDrivers || topDrivers.length === 0) && (
            <p className="text-center text-muted-foreground font-display py-8">
              Nenhum motorista sincronizado ou API Indisponível.
            </p>
          )}
        </div>

        <div className="text-center mt-8">
          <Link to="/ranking">
            <Button variant="outline" className="font-heading border-primary/30 hover:bg-primary/10">
              VER RANKING COMPLETO
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
