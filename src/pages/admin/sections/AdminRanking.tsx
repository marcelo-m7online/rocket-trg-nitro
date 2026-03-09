import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

export default function AdminRanking() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ driver_id: "", pontos: "", viagens: "", km: "", posicao: "", periodo: "mensal" });

  const { data: drivers } = useQuery({
    queryKey: ["admin-drivers-list"],
    queryFn: async () => {
      const { data } = await supabase.from("drivers").select("id, nickname").order("nickname");
      return data || [];
    },
  });

  const { data: rankings } = useQuery({
    queryKey: ["admin-ranking"],
    queryFn: async () => {
      const { data } = await supabase.from("ranking").select("*, drivers(nickname)").order("posicao");
      return data || [];
    },
  });

  const handleSave = async () => {
    if (!form.driver_id) { toast.error("Selecione um motorista"); return; }
    const { error } = await supabase.from("ranking").insert({
      driver_id: form.driver_id,
      pontos: parseInt(form.pontos) || 0,
      viagens: parseInt(form.viagens) || 0,
      km: parseInt(form.km) || 0,
      posicao: parseInt(form.posicao) || 0,
      periodo: form.periodo,
    });
    if (error) { toast.error("Erro ao salvar"); return; }
    toast.success("Ranking salvo!");
    setForm({ driver_id: "", pontos: "", viagens: "", km: "", posicao: "", periodo: "mensal" });
    setShowForm(false);
    qc.invalidateQueries({ queryKey: ["admin-ranking"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from("ranking").delete().eq("id", id);
    toast.success("Excluído!");
    qc.invalidateQueries({ queryKey: ["admin-ranking"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gradient-fire">RANKING</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
          <Plus className="h-4 w-4 mr-1" /> NOVO
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex justify-between"><h3 className="font-heading text-sm font-bold">NOVO RANKING</h3><button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-display">Motorista</Label>
              <select value={form.driver_id} onChange={(e) => setForm({ ...form, driver_id: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Selecione</option>
                {(drivers || []).map((d) => <option key={d.id} value={d.id}>{d.nickname}</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label className="text-xs font-display">Posição</Label><Input type="number" value={form.posicao} onChange={(e) => setForm({ ...form, posicao: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Pontos</Label><Input type="number" value={form.pontos} onChange={(e) => setForm({ ...form, pontos: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Viagens</Label><Input type="number" value={form.viagens} onChange={(e) => setForm({ ...form, viagens: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">KM</Label><Input type="number" value={form.km} onChange={(e) => setForm({ ...form, km: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Período</Label>
              <select value={form.periodo} onChange={(e) => setForm({ ...form, periodo: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="mensal">Mensal</option><option value="semanal">Semanal</option><option value="geral">Geral</option>
              </select>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-gradient-fire text-primary-foreground font-heading text-xs">CADASTRAR</Button>
        </div>
      )}

      <div className="space-y-2">
        {(rankings || []).map((r: any) => (
          <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
            <span className="font-heading text-lg font-bold text-primary w-8">#{r.posicao}</span>
            <div className="flex-1"><p className="font-display font-bold text-sm">{r.drivers?.nickname || "—"}</p><p className="text-xs text-muted-foreground">{r.periodo}</p></div>
            <p className="font-heading text-sm text-primary">{r.pontos} pts</p>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
