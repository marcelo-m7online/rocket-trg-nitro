import { motion } from "framer-motion";
import { Calendar, MapPin, Route } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function UpcomingConvoys() {
  const { data: convoys } = useQuery({
    queryKey: ["upcoming-convoys"],
    queryFn: async () => {
      const { data } = await supabase
        .from("comboios")
        .select("*")
        .gte("data", new Date().toISOString())
        .eq("status", "agendado")
        .order("data", { ascending: true })
        .limit(3);
      return data || [];
    },
  });

  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gradient-fire mb-2">
            PRÓXIMOS COMBOIOS
          </h2>
          <p className="text-muted-foreground font-display">Prepare-se para as próximas rotas</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {(convoys || []).map((convoy, i) => (
            <motion.div
              key={convoy.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:glow-fire transition-all group"
            >
              <div className="flex items-center gap-2 text-primary mb-3">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-display font-semibold">
                  {format(new Date(convoy.data), "dd MMM yyyy - HH:mm", { locale: ptBR })}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">{convoy.titulo}</h3>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <Route className="h-4 w-4" />
                <span className="font-display">{convoy.rota}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span className="font-display">{convoy.mapa}</span>
              </div>
            </motion.div>
          ))}

          {(!convoys || convoys.length === 0) && (
            <div className="col-span-full text-center text-muted-foreground font-display py-8">
              Nenhum comboio agendado no momento.
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link to="/comboios">
            <Button variant="outline" className="font-heading border-primary/30 hover:bg-primary/10">
              VER TODOS OS COMBOIOS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
