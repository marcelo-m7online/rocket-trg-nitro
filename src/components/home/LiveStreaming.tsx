import { motion } from "framer-motion";
import { Radio, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function LiveStreaming() {
  const { data: lives } = useQuery({
    queryKey: ["active-lives"],
    queryFn: async () => {
      const { data } = await supabase.from("lives").select("*").eq("ativa", true).order("created_at", { ascending: false });
      return data || [];
    },
  });

  if (!lives || lives.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <Radio className="h-5 w-5 text-destructive animate-pulse" />
              <h3 className="font-heading text-sm font-bold text-primary">AO VIVO AGORA</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {lives.map((live: any) => (
                <a
                  key={live.id}
                  href={live.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/30 transition-all group"
                >
                  <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  <div>
                    <p className="font-display font-bold text-foreground text-sm">{live.streamer}</p>
                    <p className="text-xs text-muted-foreground">{live.titulo} • {live.plataforma}</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
