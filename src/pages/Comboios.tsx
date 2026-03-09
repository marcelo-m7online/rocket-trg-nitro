import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Calendar, MapPin, Route, Users, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  agendado: "bg-primary/20 text-primary",
  realizado: "bg-green-500/20 text-green-400",
  cancelado: "bg-destructive/20 text-destructive",
};

export default function Comboios() {
  const { data: convoys } = useQuery({
    queryKey: ["all-convoys"],
    queryFn: async () => {
      const { data } = await supabase
        .from("comboios")
        .select("*")
        .order("data", { ascending: false });
      return data || [];
    },
  });

  return (
    <Layout>
      <section className="py-20 racing-stripe relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-heading text-4xl md:text-6xl font-black text-gradient-fire mb-4">
              COMBOIOS
            </h1>
            <p className="text-lg text-muted-foreground font-display">
              Calendário e histórico de todos os comboios
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-4">
            {(convoys || []).map((convoy, i) => (
              <motion.div
                key={convoy.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-heading text-lg font-bold text-foreground">{convoy.titulo}</h3>
                      <Badge className={statusColors[convoy.status || "agendado"]}>
                        {convoy.status}
                      </Badge>
                    </div>
                    {convoy.descricao && (
                      <p className="text-sm text-muted-foreground font-body mb-3">{convoy.descricao}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-display">
                          {format(new Date(convoy.data), "dd MMM yyyy - HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Route className="h-4 w-4 text-primary" />
                        <span className="font-display">{convoy.rota}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-display">{convoy.mapa}</span>
                      </div>
                      {convoy.participantes && convoy.participantes.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="font-display">{convoy.participantes.length} participantes</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {(!convoys || convoys.length === 0) && (
              <p className="text-center text-muted-foreground font-display py-12">
                Nenhum comboio cadastrado ainda.
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
