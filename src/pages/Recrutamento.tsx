import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Recrutamento() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    nickname: "",
    idade: "",
    discord: "",
    steam: "",
    vtlog_id: "",
    experiencia: "",
    motivacao: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.nickname) {
      toast.error("Nome e Nickname são obrigatórios!");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("recrutamento").insert({
      nome: form.nome,
      nickname: form.nickname,
      idade: form.idade ? parseInt(form.idade) : null,
      discord: form.discord || null,
      steam: form.steam || null,
      vtlog_id: form.vtlog_id || null,
      experiencia: form.experiencia || null,
      motivacao: form.motivacao || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Erro ao enviar inscrição. Tente novamente.");
    } else {
      toast.success("Inscrição enviada com sucesso! Entraremos em contato.");
      setForm({ nome: "", nickname: "", idade: "", discord: "", steam: "", vtlog_id: "", experiencia: "", motivacao: "" });
    }
  };

  return (
    <Layout>
      <section className="py-20 racing-stripe relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-heading text-4xl md:text-6xl font-black text-gradient-fire mb-4">
              RECRUTAMENTO
            </h1>
            <p className="text-lg text-muted-foreground font-display">
              Faça parte da The Rocket TRG
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-2xl">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6 p-8 rounded-xl bg-card border border-border"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-display font-semibold">Nome Completo *</Label>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <Label className="font-display font-semibold">Nickname no Jogo *</Label>
                <Input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} placeholder="Seu nick" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-display font-semibold">Idade</Label>
                <Input type="number" value={form.idade} onChange={(e) => setForm({ ...form, idade: e.target.value })} placeholder="18" />
              </div>
              <div className="space-y-2">
                <Label className="font-display font-semibold">Discord</Label>
                <Input value={form.discord} onChange={(e) => setForm({ ...form, discord: e.target.value })} placeholder="user#1234" />
              </div>
              <div className="space-y-2">
                <Label className="font-display font-semibold">Steam</Label>
                <Input value={form.steam} onChange={(e) => setForm({ ...form, steam: e.target.value })} placeholder="Link do perfil" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-display font-semibold">ID VTLOG</Label>
              <Input value={form.vtlog_id} onChange={(e) => setForm({ ...form, vtlog_id: e.target.value })} placeholder="Seu ID no VTLOG (opcional)" />
            </div>

            <div className="space-y-2">
              <Label className="font-display font-semibold">Experiência no ETS2</Label>
              <Textarea value={form.experiencia} onChange={(e) => setForm({ ...form, experiencia: e.target.value })} placeholder="Conte sobre sua experiência..." rows={3} />
            </div>

            <div className="space-y-2">
              <Label className="font-display font-semibold">Por que quer entrar na The Rocket TRG?</Label>
              <Textarea value={form.motivacao} onChange={(e) => setForm({ ...form, motivacao: e.target.value })} placeholder="Sua motivação..." rows={3} />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gradient-fire text-primary-foreground font-heading text-base py-6 glow-fire hover:scale-[1.02] transition-transform">
              {loading ? "ENVIANDO..." : "ENVIAR INSCRIÇÃO"}
            </Button>
          </motion.form>
        </div>
      </section>
    </Layout>
  );
}
