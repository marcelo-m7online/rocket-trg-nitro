import { motion } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback } from "react";

export default function GalleryCarousel() {
  const [current, setCurrent] = useState(0);

  const { data: photos } = useQuery({
    queryKey: ["gallery-carousel"],
    queryFn: async () => {
      const { data } = await supabase.from("galeria").select("*").order("data", { ascending: false }).limit(10);
      return data || [];
    },
  });

  const items = photos || [];

  const next = useCallback(() => {
    if (items.length > 0) setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  const prev = () => {
    if (items.length > 0) setCurrent((c) => (c - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [items.length, next]);

  if (items.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gradient-fire mb-2">GALERIA</h2>
          <p className="text-muted-foreground font-display">Momentos nas estradas</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="aspect-video rounded-xl overflow-hidden border border-border relative">
            {items.map((photo, i) => (
              <div
                key={photo.id}
                className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
              >
                <img src={photo.imagem_url} alt={photo.titulo} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-display font-bold text-foreground text-lg">{photo.titulo}</p>
                  {photo.descricao && <p className="text-sm text-muted-foreground mt-1">{photo.descricao}</p>}
                </div>
              </div>
            ))}
          </div>

          {items.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 border border-border hover:bg-primary/20 transition-colors">
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 border border-border hover:bg-primary/20 transition-colors">
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>

              <div className="flex justify-center gap-2 mt-4">
                {items.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-muted-foreground/30"}`} />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-8">
          <Link to="/galeria">
            <Button variant="outline" className="font-heading border-primary/30 hover:bg-primary/10">
              <Camera className="h-4 w-4 mr-2" /> VER GALERIA COMPLETA
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
