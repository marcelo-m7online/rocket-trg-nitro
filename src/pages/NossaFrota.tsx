import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Truck, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function NossaFrota() {
  const { data: trucks } = useQuery({
    queryKey: ["frota"],
    queryFn: async () => {
      const { data } = await supabase.from("caminhoes").select("*, drivers(nickname)").eq("status", "ativo").order("nome");
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
            <h1 className="font-heading text-4xl md:text-6xl font-black text-gradient-fire mb-4">NOSSA FROTA</h1>
            <p className="text-lg text-muted-foreground font-display">Caminhões e implementos da The Rocket TRG</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(trucks || []).map((truck: any, i) => (
              <motion.div
                key={truck.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="rounded-xl overflow-hidden border border-border bg-card hover:border-primary/30 transition-all group"
              >
                {truck.imagem_url ? (
                  <div className="aspect-video overflow-hidden">
                    <img src={truck.imagem_url} alt={truck.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Truck className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <h3 className="font-heading text-lg font-bold text-foreground">{truck.nome}</h3>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground font-display">
                    {truck.marca && <span className="px-2 py-1 rounded-full bg-muted">{truck.marca}</span>}
                    {truck.modelo && <span className="px-2 py-1 rounded-full bg-muted">{truck.modelo}</span>}
                    {truck.ano && <span className="px-2 py-1 rounded-full bg-muted">{truck.ano}</span>}
                    {truck.placa && <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">{truck.placa}</span>}
                  </div>
                  {truck.descricao && <p className="text-sm text-muted-foreground font-body">{truck.descricao}</p>}
                  {truck.drivers?.nickname && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="font-display">{truck.drivers.nickname}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {(!trucks || trucks.length === 0) && (
              <div className="col-span-full text-center text-muted-foreground font-display py-12">
                <Truck className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <p>Nenhum caminhão cadastrado ainda.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
