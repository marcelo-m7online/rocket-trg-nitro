import { motion } from "framer-motion";
import { Users, Target, DollarSign, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchVtlogStats } from "@/integrations/vtlog/client";

const iconMap = {
  drivers: Users,
  trips: Target,
  km: DollarSign,
  points: Trophy,
};

export default function StatsSection() {
  const { data: stats } = useQuery({
    queryKey: ["vtlog-home-stats"],
    queryFn: async () => {
      const data = await fetchVtlogStats();

      if (!data) return null;

      return [
        { label: "Motoristas Ativos", value: data.memberCount, icon: "drivers" as const },
        { label: "Level VTC", value: data.level, icon: "trips" as const },
        { label: "Lucro Total (VTLOG)", value: Math.floor(data.financial.profit || 0), icon: "km" as const },
        { label: "Experiência Pts.", value: Math.floor(data.experience || 0), icon: "points" as const },
      ];
    },
    // Cache for 5 mins
    staleTime: 5 * 60 * 1000,
  });

  const displayStats = stats || [
    { label: "Motoristas Ativos", value: 0, icon: "drivers" as const },
    { label: "Level VTC", value: 0, icon: "trips" as const },
    { label: "Lucro Total (VTLOG)", value: 0, icon: "km" as const },
    { label: "Experiência Pts.", value: 0, icon: "points" as const },
  ];

  return (
    <section className="py-16 border-b border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayStats.map((stat, i) => {
            const Icon = iconMap[stat.icon];
            // Format logic for large numbers
            const formattedValue = stat.icon === "km"
              ? `R$ ${stat.value >= 1000000 ? (stat.value / 1000000).toFixed(1) + "M" : stat.value.toLocaleString("pt-BR")}`
              : stat.value.toLocaleString("pt-BR");

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                <Icon className={`h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform ${stat.icon === "km" ? "text-green-500" : "text-primary"}`} />
                <p className="font-heading text-2xl md:text-3xl font-bold text-gradient-fire">
                  {formattedValue}
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
