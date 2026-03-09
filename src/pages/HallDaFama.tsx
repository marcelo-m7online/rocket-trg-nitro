import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Crown, Star, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const trophyColors: Record<string, string> = {
  ouro: "text-gold border-gold/30 bg-gold/10",
  prata: "text-muted-foreground border-muted-foreground/30 bg-muted",
  bronze: "text-fire-orange border-fire-orange/30 bg-fire-orange/10",
};

export default function HallDaFama() {
  const { data: entries } = useQuery({
    queryKey: ["hall-da-fama"],
    queryFn: async () => {
      const { data } = await supabase
        .from("hall_da_fama")
        .select("*, drivers(nome, nickname)")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <Layout>
      <section className="py-20 racing-stripe relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Crown className="h-12 w-12 text-gold mx-auto mb-4" />
            <h1 className="font-heading text-4xl md:text-6xl font-black text-gradient-gold mb-4">
              HALL DA FAMA
            </h1>
            <p className="text-lg text-muted-foreground font-display">
              Os lendários motoristas que marcaram história
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(entries || []).map((entry, i) => {
              const colorClass = trophyColors[entry.trofeu || "ouro"] || trophyColors.ouro;
              const driver = entry.drivers as any;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-xl border ${colorClass} transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="h-8 w-8" />
                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground">{entry.titulo}</h3>
                      <p className="text-sm text-muted-foreground font-display">
                        {driver?.nickname || "Motorista"}
                      </p>
                    </div>
                  </div>
                  {entry.descricao && (
                    <p className="text-sm text-muted-foreground font-body mb-3">{entry.descricao}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-heading text-xs">
                      {entry.tipo || "mensal"}
                    </Badge>
                    {entry.mes_referencia && (
                      <Badge variant="secondary" className="font-display text-xs">
                        {entry.mes_referencia}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {(!entries || entries.length === 0) && (
              <div className="col-span-full text-center text-muted-foreground font-display py-12">
                <Star className="h-12 w-12 text-gold/30 mx-auto mb-4" />
                <p>O Hall da Fama está esperando por novos lendários motoristas.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
