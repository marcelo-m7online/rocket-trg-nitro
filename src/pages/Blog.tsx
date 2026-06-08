import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Newspaper, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

export default function Blog() {
  const { data: posts } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("publicado", true)
          .order("data_publicacao", { ascending: false });
        if (error) throw error;
        if (data) {
          localStorage.setItem("blog_posts_backup", JSON.stringify(data));
        }
        return data || [];
      } catch (err) {
        console.error("Erro ao carregar notícias no blog:", err);
        const saved = localStorage.getItem("blog_posts_backup");
        return saved ? JSON.parse(saved) : [];
      }
    },
  });

  return (
    <Layout>
      <section className="py-20 racing-stripe relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Newspaper className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-heading text-4xl md:text-6xl font-black text-gradient-fire mb-4">
              BLOG & NOTÍCIAS
            </h1>
            <p className="text-lg text-muted-foreground font-display">
              Atualizações, eventos e novidades da The Rocket TRG
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            {(posts || []).map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.1, 0.3) }}
                className="rounded-xl bg-card border border-border hover:border-primary/30 overflow-hidden transition-all group"
              >
                <div className="flex flex-col md:flex-row">
                  {post.imagem_capa && (
                    <div className="md:w-64 h-48 md:h-auto overflow-hidden flex-shrink-0">
                      <img
                        src={post.imagem_capa}
                        alt={post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-primary font-display font-semibold">
                        {format(new Date(post.data_publicacao), "dd MMM yyyy", { locale: ptBR })}
                      </span>
                      <span className="text-xs text-muted-foreground font-display">
                        por {post.autor}
                      </span>
                    </div>
                    <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                      {post.titulo}
                    </h2>
                    <p className="text-sm text-muted-foreground font-body line-clamp-3 mb-4">
                      {post.conteudo}
                    </p>
                    <Link
                      to={`/blog/${post.slug || post.id}`}
                      className="inline-flex items-center gap-1 text-sm text-primary font-display font-semibold hover:underline"
                    >
                      Ler mais <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}

            {(!posts || posts.length === 0) && (
              <div className="text-center text-muted-foreground font-display py-12">
                <Newspaper className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <p>Nenhuma notícia publicada ainda.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
