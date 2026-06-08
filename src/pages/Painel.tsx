import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Target, DollarSign, Gauge, KeyRound, Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

interface VtlogUserStats {
    steam_id: string;
    username: string;
    avatar?: string;
    experience: number;
    level: number;
    financial: {
        profit: number;
    };
}

export default function Painel() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(false);
    const [vtlogIdInput, setVtlogIdInput] = useState("");
    const navigate = useNavigate();

    // The user's metadata contains their specific vtlog_id
    const userVtlogId = session?.user?.user_metadata?.vtlog_id;

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                navigate("/login");
            } else {
                setSession(data.session);
                if (data.session.user.user_metadata?.vtlog_id) {
                    setVtlogIdInput(data.session.user.user_metadata.vtlog_id);
                }
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate("/login");
            } else {
                setSession(session);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const { data: myStats, isLoading: loadingStats } = useQuery({
        queryKey: ["my-vtlog-stats", userVtlogId],
        queryFn: async () => {
            if (!userVtlogId) return null;
            const res = await fetch(`https://api.vtlog.net/v1/user/${userVtlogId}`);
            if (!res.ok) throw new Error("VTLOG ID Inválido");
            const data: VtlogUserStats = await res.json();
            return data;
        },
        enabled: !!userVtlogId, // Only runs if ID exists
        staleTime: 60 * 1000,
    });

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success("Saiu com sucesso!");
        navigate("/login");
    };

    const handleSaveVtlogId = async () => {
        if (!vtlogIdInput || vtlogIdInput.length < 5) {
            toast.error("Insira o seu ID oficial ou Steam ID da VTLOG válido.");
            return;
        }

        setSavingId(true);
        const { data, error } = await supabase.auth.updateUser({
            data: { vtlog_id: vtlogIdInput }
        });
        setSavingId(false);

        if (error) {
            toast.error("Erro ao salvar o VTLOG ID na sua conta.");
        } else {
            toast.success("VTLOG ID vinculado! Baixando seus dados...");
            setSession({ ...session, user: data.user }); // refresh locally
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-[80vh] flex items-center justify-center">
                    <div className="animate-pulse text-primary font-heading text-xl">Carregando painel digital...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-xl p-8 shadow-2xl"
                    >
                        {/* Cabeçalho do Painel */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border pb-6 mb-8">
                            <div className="flex items-center gap-4">
                                {myStats?.avatar ? (
                                    <img src={myStats.avatar} alt="Avatar" className="w-16 h-16 rounded-full border border-primary/20 object-cover" />
                                ) : (
                                    <div className="bg-primary/10 p-4 rounded-full border border-primary/20">
                                        <User className="h-10 w-10 text-primary" />
                                    </div>
                                )}
                                <div>
                                    <h1 className="font-heading text-3xl font-black text-gradient-fire leading-none pb-1">
                                        {myStats ? myStats.username : session?.user?.user_metadata?.full_name || "Painel do Colaborador"}
                                    </h1>
                                    <p className="text-muted-foreground font-display text-sm mt-1 flex items-center gap-2">
                                        E-Mail: <span className="text-white font-medium">{session?.user?.email}</span>
                                    </p>
                                </div>
                            </div>
                            <Button onClick={handleLogout} variant="destructive" className="font-heading hover:scale-105 transition-transform">
                                <LogOut className="h-4 w-4 mr-2" />
                                DESCONECTAR
                            </Button>
                        </div>

                        {!userVtlogId && (
                            <div className="bg-fire-orange/10 border border-fire-orange/30 rounded-lg p-6 flex flex-col items-start gap-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <KeyRound className="h-6 w-6 text-fire-orange" />
                                    <h3 className="font-heading text-xl text-fire-orange">Vincule sua conta VTLOG</h3>
                                </div>
                                <p className="text-muted-foreground font-display text-sm leading-relaxed max-w-3xl">
                                    Para preencher o seu painel com as suas entregas e pontuações, você precisa conectar
                                    a sua CNH Digital. Digite seu ID da VTLOG ou seu Steam64 ID para puxar seus dados instantaneamente.
                                </p>
                                <div className="flex w-full md:w-1/2 gap-2 mt-2">
                                    <Input
                                        placeholder="Steam ID ou VTLOG ID"
                                        value={vtlogIdInput}
                                        onChange={(e) => setVtlogIdInput(e.target.value)}
                                        className="border-primary/20 focus-visible:ring-primary/50 text-white"
                                    />
                                    <Button onClick={handleSaveVtlogId} disabled={savingId} className="bg-gradient-fire hover:scale-105 font-heading transition-transform">
                                        {savingId ? "LIGANDO..." : "VINCULAR"}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Grid de Informações Vitais */}
                        <h2 className="text-xl font-heading text-white mb-4 flex items-center gap-2">
                            <Gauge className="text-primary w-5 h-5" /> Seus Status Físicos (VTLOG Oficial)
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-background p-6 rounded-lg border border-border flex flex-col justify-center items-center text-center">
                                <Target className="h-8 w-8 text-primary mb-3" />
                                <h3 className="font-heading text-lg text-white">Seu Level</h3>
                                <p className="text-3xl font-bold font-display text-primary mt-2">
                                    {loadingStats ? "..." : myStats?.level || "--"}
                                </p>
                                <div className="text-xs text-muted-foreground mt-2">Nível corporativo</div>
                            </div>

                            <div className="bg-background p-6 rounded-lg border border-primary/30 flex flex-col justify-center items-center text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-fire opacity-20 filter blur-2xl"></div>
                                <DollarSign className="h-8 w-8 text-primary mb-3" />
                                <h3 className="font-heading text-lg text-white">Lucro Gerado</h3>
                                <p className="text-3xl font-bold font-display text-gradient-fire mt-2 flex flex-col">
                                    {loadingStats ? "..." : (myStats ? `R$ ${(myStats.financial.profit / 1000).toFixed(1)}k` : "--")}
                                </p>
                                <div className="text-xs text-muted-foreground mt-2">Patrimônio acumulado</div>
                            </div>

                            <div className="bg-background p-6 rounded-lg border border-border flex flex-col justify-center items-center text-center">
                                <Gauge className="h-8 w-8 text-primary mb-3" />
                                <h3 className="font-heading text-lg text-white">Experiência (Pts)</h3>
                                <p className="text-3xl font-bold font-display text-primary mt-2">
                                    {loadingStats ? "..." : (myStats ? Math.floor(myStats.experience).toLocaleString("pt-BR") : "--")}
                                </p>
                                <div className="text-xs text-muted-foreground mt-2">Métricas VTLOG</div>
                            </div>
                        </div>

                        {/* Aviso central ao Motorista */}
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 flex flex-col items-start gap-2 relative overflow-hidden">
                            <Check className="absolute -right-4 -bottom-4 h-24 w-24 text-primary opacity-5" />
                            <h3 className="font-heading text-xl text-primary flex items-center gap-2">
                                Relatório de Contrato
                            </h3>
                            <p className="text-muted-foreground font-display text-sm leading-relaxed relative z-10 w-11/12">
                                Olá motorista, seu vínculo com a plataforma <strong>The Rocket TRG</strong> está completamente selado.
                                Qualquer Carga despachada usando seu Tracker VTLOG será registrada e creditada automaticamente em sua folha salarial da empresa com cálculos em tempo real. Continue focado nas estradas. A central da Base cuida do resto!
                            </p>
                            {userVtlogId && (
                                <Button variant="link" onClick={() => setVtlogIdInput("")} className="px-0 mt-3 text-red-400 hover:text-red-300">
                                    Deseja alterar seu ID VTLOG ({userVtlogId})? Mudar Configuração
                                </Button>
                            )}
                        </div>

                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
