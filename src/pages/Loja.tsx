import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ShoppingBag, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Loja() {
  const { data: products } = useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("produtos")
        .select("*")
        .eq("ativo", true)
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
            <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-heading text-4xl md:text-6xl font-black text-gradient-fire mb-4">
              LOJA
            </h1>
            <p className="text-lg text-muted-foreground font-display">
              Produtos exclusivos da The Rocket TRG
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(products || []).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.1, 0.4) }}
                className="rounded-xl bg-card border border-border hover:border-primary/30 overflow-hidden transition-all group"
              >
                {product.imagem_url ? (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.imagem_url}
                      alt={product.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-secondary flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading text-sm font-bold text-foreground">{product.nome}</h3>
                    {product.estoque <= 0 && (
                      <Badge variant="destructive" className="text-xs">Esgotado</Badge>
                    )}
                  </div>
                  {product.descricao && (
                    <p className="text-xs text-muted-foreground font-body mb-3 line-clamp-2">
                      {product.descricao}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xl font-bold text-primary">
                      R$ {product.preco.toFixed(2).replace(".", ",")}
                    </span>
                    <Button
                      size="sm"
                      disabled={product.estoque <= 0}
                      className="bg-gradient-fire text-primary-foreground font-heading text-xs"
                    >
                      COMPRAR
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {(!products || products.length === 0) && (
              <div className="col-span-full text-center text-muted-foreground font-display py-12">
                <ShoppingBag className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <p>Nenhum produto disponível no momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
