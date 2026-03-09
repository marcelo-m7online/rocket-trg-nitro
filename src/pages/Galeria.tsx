import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Camera, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export default function Galeria() {
  const [selected, setSelected] = useState<{ url: string; titulo: string; descricao?: string } | null>(null);

  const { data: photos } = useQuery({
    queryKey: ["galeria"],
    queryFn: async () => {
      const { data } = await supabase.from("galeria").select("*").order("data", { ascending: false });
      return data || [];
    },
  });

  return (
    <Layout>
      <section className="py-20 racing-stripe relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-heading text-4xl md:text-6xl font-black text-gradient-fire mb-4">GALERIA</h1>
            <p className="text-lg text-muted-foreground font-display">Momentos épicos nas estradas do RBR</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(photos || []).map((photo: any, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                onClick={() => setSelected({ url: photo.imagem_url, titulo: photo.titulo, descricao: photo.descricao })}
                className="rounded-xl overflow-hidden border border-border hover:border-primary/30 cursor-pointer group relative"
              >
                <div className="aspect-video">
                  <img src={photo.imagem_url} alt={photo.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">{photo.titulo}</p>
                    {photo.descricao && <p className="text-xs text-muted-foreground mt-1">{photo.descricao}</p>}
                  </div>
                </div>
                {/* Always-visible title */}
                <div className="p-3 bg-card">
                  <p className="font-display font-semibold text-foreground text-sm truncate">{photo.titulo}</p>
                  {photo.descricao && <p className="text-xs text-muted-foreground truncate">{photo.descricao}</p>}
                </div>
              </motion.div>
            ))}

            {(!photos || photos.length === 0) && (
              <div className="col-span-full text-center text-muted-foreground font-display py-12">
                <Camera className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <p>Nenhuma foto na galeria ainda.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <button className="absolute top-4 right-4 text-foreground hover:text-primary" onClick={() => setSelected(null)}>
            <X className="h-8 w-8" />
          </button>
          <div className="max-w-4xl w-full">
            <img src={selected.url} alt={selected.titulo} className="max-w-full max-h-[80vh] rounded-xl mx-auto" />
            <div className="text-center mt-4">
              <p className="font-display font-bold text-foreground text-lg">{selected.titulo}</p>
              {selected.descricao && <p className="text-sm text-muted-foreground mt-1">{selected.descricao}</p>}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
