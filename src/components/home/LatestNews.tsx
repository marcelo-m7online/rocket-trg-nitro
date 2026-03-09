import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function LatestNews() {
  const { data: posts } = useQuery({
    queryKey: ["latest-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("publicado", true)
        .order("data_publicacao", { ascending: false })
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
            ÚLTIMAS NOTÍCIAS
          </h2>
          <p className="text-muted-foreground font-display">Fique por dentro das novidades</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {(posts || []).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-xl bg-card border border-border hover:border-primary/30 transition-all overflow-hidden group"
            >
              {post.imagem_capa && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={post.imagem_capa}
                    alt={post.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="text-xs text-primary font-display font-semibold mb-2">
                  {format(new Date(post.data_publicacao), "dd MMM yyyy", { locale: ptBR })}
                </p>
                <h3 className="font-heading text-base font-bold text-foreground mb-2 line-clamp-2">
                  {post.titulo}
                </h3>
                <p className="text-sm text-muted-foreground font-body line-clamp-2">
                  {post.conteudo.substring(0, 120)}...
                </p>
              </div>
            </motion.div>
          ))}

          {(!posts || posts.length === 0) && (
            <div className="col-span-full text-center text-muted-foreground font-display py-8">
              Nenhuma notícia publicada ainda.
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link to="/blog">
            <Button variant="outline" className="font-heading border-primary/30 hover:bg-primary/10">
              VER TODAS AS NOTÍCIAS
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
