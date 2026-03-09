import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const positionIcons = [Trophy, Medal, Award];
const positionColors = ["text-gold", "text-muted-foreground", "text-fire-orange"];

export default function QuickRanking() {
  const { data: topDrivers } = useQuery({
    queryKey: ["top-drivers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("drivers")
        .select("*")
        .eq("status", "ativo")
        .order("pontos", { ascending: false })
        .limit(5);
      return data || [];
    },
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
          {(topDrivers || []).map((driver, i) => {
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
                <Icon className={`h-6 w-6 ${color}`} />
                <div className="flex-1">
                  <p className="font-display font-bold text-foreground">{driver.nickname}</p>
                  <p className="text-xs text-muted-foreground">{driver.nome}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-lg font-bold text-primary">
                    {driver.pontos.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-muted-foreground">pontos</p>
                </div>
              </motion.div>
            );
          })}

          {(!topDrivers || topDrivers.length === 0) && (
            <p className="text-center text-muted-foreground font-display py-8">
              Nenhum motorista cadastrado ainda.
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
