import { motion } from "framer-motion";
import { Users, Route, MapPin, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap = {
  drivers: Users,
  trips: Route,
  km: MapPin,
  points: Trophy,
};

export default function StatsSection() {
  const { data: stats } = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const { data: drivers } = await supabase
        .from("drivers")
        .select("km_rodados, viagens, pontos")
        .eq("status", "ativo");

      const totalDrivers = drivers?.length || 0;
      const totalKm = drivers?.reduce((acc, d) => acc + d.km_rodados, 0) || 0;
      const totalTrips = drivers?.reduce((acc, d) => acc + d.viagens, 0) || 0;
      const totalPoints = drivers?.reduce((acc, d) => acc + d.pontos, 0) || 0;

      return [
        { label: "Motoristas Ativos", value: totalDrivers, icon: "drivers" as const },
        { label: "Viagens Realizadas", value: totalTrips, icon: "trips" as const },
        { label: "KM Rodados", value: totalKm, icon: "km" as const },
        { label: "Pontos Totais", value: totalPoints, icon: "points" as const },
      ];
    },
  });

  const displayStats = stats || [
    { label: "Motoristas Ativos", value: 0, icon: "drivers" as const },
    { label: "Viagens Realizadas", value: 0, icon: "trips" as const },
    { label: "KM Rodados", value: 0, icon: "km" as const },
    { label: "Pontos Totais", value: 0, icon: "points" as const },
  ];

  return (
    <section className="py-16 border-b border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayStats.map((stat, i) => {
            const Icon = iconMap[stat.icon];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                <Icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-heading text-2xl md:text-3xl font-bold text-gradient-fire">
                  {stat.value.toLocaleString("pt-BR")}
                </p>
                <p className="text-sm text-muted-foreground font-display mt-1">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
