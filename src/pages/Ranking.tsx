import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, DollarSign, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchVtlogRanking } from "@/integrations/vtlog/client";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import DriverProfileModal from "@/components/DriverProfileModal";

const positionStyles = [
  { bg: "bg-gold/10 border-gold/30", icon: Trophy, color: "text-gold", badge: "bg-gold text-gold-foreground" },
  { bg: "bg-muted border-muted-foreground/20", icon: Medal, color: "text-muted-foreground", badge: "bg-muted text-muted-foreground" },
  { bg: "bg-fire-orange/10 border-fire-orange/30", icon: Award, color: "text-fire-orange", badge: "bg-fire-orange/20 text-fire-orange" },
];

export default function Ranking() {
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const { data: drivers, isLoading } = useQuery({
    queryKey: ["vtlog-ranking-full"],
    queryFn: async () => {
      const data = await fetchVtlogRanking();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Layout>
      <section className="py-20 racing-stripe relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Trophy className="h-12 w-12 text-gold mx-auto mb-4" />
            <h1 className="font-heading text-4xl md:text-6xl font-black text-gradient-fire mb-4">RANKING VTLOG</h1>
            <p className="text-lg text-muted-foreground font-display">Classificação em tempo real da VTLOG</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-4xl">
          {isLoading && (
            <div className="text-center text-muted-foreground font-display py-12 animate-pulse">
              Carregando dados da VTLOG...
            </div>
          )}

          {!isLoading && drivers && drivers.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-12">
              {[1, 0, 2].map((pos) => {
                const driver = drivers[pos];
                if (!driver) return null;
                const style = positionStyles[pos];
                return (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: pos * 0.2 }}
                    onClick={() => setSelectedDriver(driver)}
                    className={`p-6 rounded-xl border ${style.bg} text-center ${pos === 0 ? "md:-mt-8" : ""} cursor-pointer hover:scale-105 transition-transform`}
                  >
                    <style.icon className={`h-10 w-10 ${style.color} mx-auto mb-3`} />
                    <p className="font-heading text-xl font-bold text-foreground truncate">{driver.nickname}</p>
                    <p className="text-xs text-muted-foreground font-body truncate">{driver.nome}</p>
                    <p className="font-heading text-2xl font-black text-primary mt-2 flex flex-col items-center">
                      {driver.pontos.toLocaleString("pt-BR")}
                      <span className="text-xs text-muted-foreground font-normal">exp</span>
                    </p>
                    <div className="flex justify-center flex-wrap gap-2 mt-3">
                      <Badge className={style.badge}>#{pos + 1}</Badge>
                      <Badge variant="outline" className="border-primary/20 bg-background">Lvl {driver.level}</Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!isLoading && (
            <div className="space-y-2">
              {(drivers || []).map((driver: any, i) => (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.05, 0.5) }}
                  onClick={() => setSelectedDriver(driver)}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:border-primary/30 ${i < 3 ? "bg-card border-primary/20" : "bg-card border-border"
                    }`}
                >
                  <span className={`font-heading text-xl font-bold w-10 text-center ${i === 0 ? "text-gold" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-fire-orange" : "text-muted-foreground"
                    }`}>
                    #{i + 1}
                  </span>

                  {driver.avatar ? (
                    <img src={driver.avatar} alt={driver.nickname} className="w-10 h-10 rounded-full object-cover border border-border" />
                  ) : (
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-muted-foreground border border-border">
                      {driver.nickname.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-foreground truncate hover:text-primary transition-colors">{driver.nickname}</p>
                    <p className="text-xs text-muted-foreground truncate">{driver.nome}</p>
                  </div>

                  <div className="hidden sm:flex items-center gap-6 pr-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1" title="Level VTLOG">
                      <Target className="h-4 w-4 text-primary/70" />
                      <span className="font-display">Lvl {driver.level}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Lucro VTLOG">
                      <DollarSign className="h-4 w-4 text-green-500/70" />
                      <span className="font-display text-green-500/90 whitespace-nowrap">
                        R$ {driver.lucro?.toLocaleString("pt-BR") || 0}
                      </span>
                    </div>
                  </div>

                  <div className="text-right w-24">
                    <p className="font-heading text-lg font-bold text-primary">{driver.pontos.toLocaleString("pt-BR")}</p>
                    <p className="text-xs text-muted-foreground">exp</p>
                  </div>
                </motion.div>
              ))}

              {(!drivers || drivers.length === 0) && (
                <p className="text-center text-muted-foreground font-display py-12">Nenhum motorista no ranking ainda.</p>
              )}
            </div>
          )}
        </div>
      </section>

      <DriverProfileModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
    </Layout>
  );
}
