import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import logoImg from "@/assets/logo-rocket-trg.jpeg";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Credenciais inválidas.");
    } else {
      toast.success("Login realizado!");
      onLogin();
    }
  };

  const handleDemoMode = () => {
    localStorage.setItem("admin_demo_mode", "true");
    toast.success("Modo demo ativado!");
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img src={logoImg} alt="The Rocket TRG" className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-primary/30" />
          <h1 className="font-heading text-2xl font-bold text-gradient-fire">PAINEL ADMIN</h1>
          <p className="text-muted-foreground font-display text-sm mt-1">The Rocket TRG</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4 p-6 rounded-xl bg-card border border-border">
          <div className="space-y-2">
            <Label className="font-display">E-mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@therockettrg.com" />
          </div>
          <div className="space-y-2">
            <Label className="font-display">Senha</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-fire text-primary-foreground font-heading glow-fire">
            <Lock className="h-4 w-4 mr-2" />
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </Button>
        </form>
        <div className="space-y-2">
          <p className="text-center text-xs text-muted-foreground">Ou teste sem autenticação:</p>
          <Button onClick={handleDemoMode} variant="outline" className="w-full font-heading text-sm">
            MODO DEMO
          </Button>
        </div>
      </div>
    </div>
  );
}
