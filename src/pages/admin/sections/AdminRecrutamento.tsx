import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminRecrutamento() {
  const qc = useQueryClient();

  const { data: recrutas } = useQuery({
    queryKey: ["admin-recrutamento"],
    queryFn: async () => {
      const { data } = await supabase.from("recrutamento").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("recrutamento").update({ status }).eq("id", id);
    if (error) { toast.error("Erro"); return; }
    toast.success(`Status atualizado para ${status}!`);
    qc.invalidateQueries({ queryKey: ["admin-recrutamento"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from("recrutamento").delete().eq("id", id);
    toast.success("Excluído!"); qc.invalidateQueries({ queryKey: ["admin-recrutamento"] });
  };

  const statusIcon = (s: string) => {
    if (s === "aprovado") return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (s === "rejeitado") return <XCircle className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4 text-primary" />;
  };

  const statusColor = (s: string) => {
    if (s === "aprovado") return "bg-green-500/20 text-green-400";
    if (s === "rejeitado") return "bg-destructive/20 text-destructive";
    return "bg-primary/20 text-primary";
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-gradient-fire mb-6">RECRUTAMENTO</h2>

      <div className="space-y-3">
        {(recrutas || []).map((r: any) => (
          <div key={r.id} className="p-5 rounded-xl bg-card border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-foreground">{r.nome} ({r.nickname})</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(r.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {statusIcon(r.status)}
                <span className={`text-xs px-2 py-1 rounded-full font-display ${statusColor(r.status)}`}>{r.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
              {r.idade && <p><span className="font-display font-semibold text-foreground">Idade:</span> {r.idade}</p>}
              {r.discord && <p><span className="font-display font-semibold text-foreground">Discord:</span> {r.discord}</p>}
              {r.steam && <p><span className="font-display font-semibold text-foreground">Steam:</span> {r.steam}</p>}
              {r.vtlog_id && <p><span className="font-display font-semibold text-foreground">VTLOG:</span> {r.vtlog_id}</p>}
            </div>

            {r.experiencia && <p className="text-xs text-muted-foreground"><span className="font-display font-semibold text-foreground">Experiência:</span> {r.experiencia}</p>}
            {r.motivacao && <p className="text-xs text-muted-foreground"><span className="font-display font-semibold text-foreground">Motivação:</span> {r.motivacao}</p>}

            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "aprovado")} className="text-xs font-display border-green-500/30 text-green-400 hover:bg-green-500/10">
                <CheckCircle className="h-3 w-3 mr-1" /> Aprovar
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "rejeitado")} className="text-xs font-display border-destructive/30 text-destructive hover:bg-destructive/10">
                <XCircle className="h-3 w-3 mr-1" /> Rejeitar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          </div>
        ))}

        {(!recrutas || recrutas.length === 0) && (
          <p className="text-center text-muted-foreground font-display py-12">Nenhuma inscrição recebida.</p>
        )}
      </div>
    </div>
  );
}
