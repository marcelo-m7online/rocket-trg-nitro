import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Preencha todos os campos.");
            return;
        }
        setLoading(true);

        // Auth Login
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        setLoading(false);
        if (error) {
            toast.error("Credenciais inválidas. Tente novamente ou verifique se confirmou o E-mail.");
        } else {
            toast.success("Bem vindo de volta!");
            navigate("/painel");
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
                        <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h1 className="font-heading text-3xl md:text-4xl font-black text-gradient-fire mb-2">
                            PORTAL DO MOTORISTA
                        </h1>
                        <p className="text-muted-foreground font-display">
                            Acesso exclusivo
                        </p>
                    </motion.div>

                    <form onSubmit={handleLogin} className="space-y-4 p-8 rounded-xl bg-card border border-border">
                        <div className="space-y-2">
                            <Label className="font-display">E-mail</Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu.email@exemplo.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-display">Senha</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full bg-gradient-fire text-primary-foreground font-heading mt-4 glow-fire hover:scale-[1.02] transition-transform">
                            {loading ? "CARREGANDO..." : "ENTRAR"}
                        </Button>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-muted-foreground font-display">
                                Ainda não tem conta? <Link to="/cadastro" className="text-primary hover:underline hover:text-white transition-colors">Cadastre-se</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </Layout>
    );
}
