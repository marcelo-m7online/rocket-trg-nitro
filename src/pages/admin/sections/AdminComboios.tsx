import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Edit, X } from "lucide-react";

const empty = { titulo: "", data: "", rota: "", mapa: "RBR", descricao: "", status: "agendado" };

export default function AdminComboios() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: comboios } = useQuery({
    queryKey: ["admin-comboios"],
    queryFn: async () => {
      const { data } = await supabase.from("comboios").select("*").order("data", { ascending: false });
      return data || [];
    },
  });

  const handleSave = async () => {
    if (!form.titulo || !form.data || !form.rota) { toast.error("Preencha os campos obrigatórios"); return; }
    const payload = { titulo: form.titulo, data: form.data, rota: form.rota, mapa: form.mapa, descricao: form.descricao || null, status: form.status };
    if (editingId) {
      const { error } = await supabase.from("comboios").update(payload).eq("id", editingId);
      if (error) { toast.error("Erro"); return; }
      toast.success("Comboio atualizado!");
    } else {
      const { error } = await supabase.from("comboios").insert(payload);
      if (error) { toast.error("Erro"); return; }
      toast.success("Comboio cadastrado!");
    }
    setForm(empty); setEditingId(null); setShowForm(false);
    qc.invalidateQueries({ queryKey: ["admin-comboios"] });
  };

  const handleEdit = (c: any) => {
    setForm({ titulo: c.titulo, data: c.data?.slice(0, 16) || "", rota: c.rota, mapa: c.mapa || "RBR", descricao: c.descricao || "", status: c.status || "agendado" });
    setEditingId(c.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from("comboios").delete().eq("id", id);
    toast.success("Excluído!"); qc.invalidateQueries({ queryKey: ["admin-comboios"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gradient-fire">COMBOIOS</h2>
        <Button onClick={() => { setShowForm(!showForm); setForm(empty); setEditingId(null); }} className="bg-gradient-fire text-primary-foreground font-heading text-xs"><Plus className="h-4 w-4 mr-1" /> NOVO</Button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex justify-between"><h3 className="font-heading text-sm font-bold">{editingId ? "EDITAR" : "NOVO"} COMBOIO</h3><button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label className="text-xs font-display">Título</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Data/Hora</Label><Input type="datetime-local" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Rota</Label><Input value={form.rota} onChange={(e) => setForm({ ...form, rota: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Mapa</Label><Input value={form.mapa} onChange={(e) => setForm({ ...form, mapa: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Status</Label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="agendado">Agendado</option><option value="realizado">Realizado</option><option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          <div className="space-y-1"><Label className="text-xs font-display">Descrição</Label><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} /></div>
          <Button onClick={handleSave} className="bg-gradient-fire text-primary-foreground font-heading text-xs">{editingId ? "ATUALIZAR" : "CADASTRAR"}</Button>
        </div>
      )}

      <div className="space-y-2">
        {(comboios || []).map((c) => (
          <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm truncate">{c.titulo}</p>
              <p className="text-xs text-muted-foreground">{c.rota} • {c.mapa}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-display ${c.status === "agendado" ? "bg-primary/20 text-primary" : c.status === "realizado" ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"}`}>{c.status}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
