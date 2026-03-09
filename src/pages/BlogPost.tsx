import Layout from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      // Try slug first, then id
      let { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("publicado", true)
        .maybeSingle();

      if (!data) {
        const result = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", slug!)
          .eq("publicado", true)
          .maybeSingle();
        data = result.data;
      }
      return data;
    },
    enabled: !!slug,
  });

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-3xl">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6 font-display">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Blog
            </Button>
          </Link>

          {isLoading && (
            <div className="text-center text-muted-foreground py-12">Carregando...</div>
          )}

          {post && (
            <article>
              {post.imagem_capa && (
                <div className="rounded-xl overflow-hidden mb-8">
                  <img src={post.imagem_capa} alt={post.titulo} className="w-full h-64 md:h-96 object-cover" />
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-primary font-display font-semibold">
                  {format(new Date(post.data_publicacao), "dd MMMM yyyy", { locale: ptBR })}
                </span>
                <span className="text-sm text-muted-foreground font-display">por {post.autor}</span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-black text-foreground mb-6">
                {post.titulo}
              </h1>
              <div className="prose prose-invert max-w-none font-body text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {post.conteudo}
              </div>
            </article>
          )}

          {!isLoading && !post && (
            <div className="text-center text-muted-foreground py-12">
              Post não encontrado.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
