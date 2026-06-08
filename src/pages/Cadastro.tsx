import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !password) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    
    // Auth Signup
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: nome,
        }
      }
    });
    
    setLoading(false);
    if (error) {
      toast.error("Erro ao criar conta: " + error.message);
    } else {
      toast.success("Conta criada! Você já pode fazer login.");
      setNome("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <Layout>
      <section className="py-20 flex items-center justify-center min-h-[80vh]">
        <div className="container mx-auto max-w-md px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-heading text-3xl md:text-4xl font-black text-gradient-fire mb-2">
              CRIAR CONTA
            </h1>
            <p className="text-muted-foreground font-display">
              Junte-se ao sistema da The Rocket TRG
            </p>
          </motion.div>

          <form onSubmit={handleSignup} className="space-y-4 p-8 rounded-xl bg-card border border-border">
            <div className="space-y-2">
              <Label className="font-display">Nome Completo</Label>
              <Input 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                placeholder="Seu nome completo" 
              />
            </div>
            <div className="space-y-2">
              <Label className="font-display">E-mail</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="seuemail@exemplo.com" 
              />
            </div>
            <div className="space-y-2">
              <Label className="font-display">Senha</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Uma senha segura" 
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full bg-gradient-fire text-primary-foreground font-heading mt-4 glow-fire hover:scale-[1.02] transition-transform">
              {loading ? "CADASTRANDO..." : "CADASTRAR"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
