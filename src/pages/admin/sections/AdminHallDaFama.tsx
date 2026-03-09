import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";

export default function AdminHallDaFama() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ driver_id: "", titulo: "", descricao: "", trofeu: "ouro", tipo: "mensal", mes_referencia: "" });

  const { data: drivers } = useQuery({
    queryKey: ["admin-drivers-list"],
    queryFn: async () => {
      const { data } = await supabase.from("drivers").select("id, nickname").order("nickname");
      return data || [];
    },
  });

  const { data: entries } = useQuery({
    queryKey: ["admin-hall"],
    queryFn: async () => {
      const { data } = await supabase.from("hall_da_fama").select("*, drivers(nickname)").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const handleSave = async () => {
    if (!form.driver_id || !form.titulo) { toast.error("Motorista e título obrigatórios"); return; }
    const { error } = await supabase.from("hall_da_fama").insert({
      driver_id: form.driver_id, titulo: form.titulo, descricao: form.descricao || null,
      trofeu: form.trofeu, tipo: form.tipo, mes_referencia: form.mes_referencia || null,
    });
    if (error) { toast.error("Erro"); return; }
    toast.success("Adicionado ao Hall da Fama!");
    setForm({ driver_id: "", titulo: "", descricao: "", trofeu: "ouro", tipo: "mensal", mes_referencia: "" });
    setShowForm(false); qc.invalidateQueries({ queryKey: ["admin-hall"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from("hall_da_fama").delete().eq("id", id);
    toast.success("Excluído!"); qc.invalidateQueries({ queryKey: ["admin-hall"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gradient-gold">HALL DA FAMA</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-fire text-primary-foreground font-heading text-xs"><Plus className="h-4 w-4 mr-1" /> NOVO</Button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex justify-between"><h3 className="font-heading text-sm font-bold">NOVA CONQUISTA</h3><button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label className="text-xs font-display">Motorista</Label>
              <select value={form.driver_id} onChange={(e) => setForm({ ...form, driver_id: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Selecione</option>
                {(drivers || []).map((d) => <option key={d.id} value={d.id}>{d.nickname}</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label className="text-xs font-display">Título</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Troféu</Label>
              <select value={form.trofeu} onChange={(e) => setForm({ ...form, trofeu: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="ouro">Ouro</option><option value="prata">Prata</option><option value="bronze">Bronze</option>
              </select>
            </div>
            <div className="space-y-1"><Label className="text-xs font-display">Tipo</Label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="mensal">Mensal</option><option value="anual">Anual</option><option value="especial">Especial</option>
              </select>
            </div>
            <div className="space-y-1"><Label className="text-xs font-display">Mês Referência</Label><Input value={form.mes_referencia} onChange={(e) => setForm({ ...form, mes_referencia: e.target.value })} placeholder="Ex: Março 2026" /></div>
          </div>
          <div className="space-y-1"><Label className="text-xs font-display">Descrição</Label><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} /></div>
          <Button onClick={handleSave} className="bg-gradient-fire text-primary-foreground font-heading text-xs">CADASTRAR</Button>
        </div>
      )}

      <div className="space-y-2">
        {(entries || []).map((e: any) => (
          <div key={e.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm truncate">{e.titulo}</p>
              <p className="text-xs text-muted-foreground">{e.drivers?.nickname} • {e.trofeu} • {e.tipo}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
