import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit, X } from "lucide-react";

interface DriverForm {
  nome: string;
  nickname: string;
  vtlog_id: string;
  cargo: string;
  status: string;
}

const emptyForm: DriverForm = { nome: "", nickname: "", vtlog_id: "", cargo: "Motorista", status: "ativo" };

export default function AdminDrivers() {
  const qc = useQueryClient();
  const [form, setForm] = useState<DriverForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: drivers } = useQuery({
    queryKey: ["admin-drivers"],
    queryFn: async () => {
      const { data } = await supabase.from("drivers").select("*").order("pontos", { ascending: false });
      return data || [];
    },
  });

  const handleSave = async () => {
    if (!form.nome || !form.nickname) { toast.error("Nome e Nickname obrigatórios"); return; }
    if (editingId) {
      const { error } = await supabase.from("drivers").update({
        nome: form.nome, nickname: form.nickname, vtlog_id: form.vtlog_id || null,
        cargo: form.cargo, status: form.status,
      }).eq("id", editingId);
      if (error) { toast.error("Erro ao atualizar"); return; }
      toast.success("Motorista atualizado!");
    } else {
      const { error } = await supabase.from("drivers").insert({
        nome: form.nome, nickname: form.nickname, vtlog_id: form.vtlog_id || null,
        cargo: form.cargo, status: form.status,
      });
      if (error) { toast.error("Erro ao cadastrar"); return; }
      toast.success("Motorista cadastrado!");
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    qc.invalidateQueries({ queryKey: ["admin-drivers"] });
  };

  const handleEdit = (driver: any) => {
    setForm({ nome: driver.nome, nickname: driver.nickname, vtlog_id: driver.vtlog_id || "", cargo: driver.cargo || "Motorista", status: driver.status });
    setEditingId(driver.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este motorista?")) return;
    await supabase.from("drivers").delete().eq("id", id);
    toast.success("Motorista excluído!");
    qc.invalidateQueries({ queryKey: ["admin-drivers"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gradient-fire">MOTORISTAS</h2>
        <Button onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditingId(null); }} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
          <Plus className="h-4 w-4 mr-1" /> NOVO
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-sm font-bold text-foreground">{editingId ? "EDITAR" : "NOVO"} MOTORISTA</h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); }}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-display">Nome</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-display">Nickname</Label>
              <Input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-display">VTLOG ID</Label>
              <Input value={form.vtlog_id} onChange={(e) => setForm({ ...form, vtlog_id: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-display">Cargo</Label>
              <Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-display">Status</Label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="afastado">Afastado</option>
              </select>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
            {editingId ? "ATUALIZAR" : "CADASTRAR"}
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {(drivers || []).map((d) => (
          <div key={d.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all">
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-foreground text-sm truncate">{d.nickname}</p>
              <p className="text-xs text-muted-foreground">{d.nome} • {d.cargo}</p>
            </div>
            <span className={`text-xs font-display px-2 py-1 rounded-full ${d.status === "ativo" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
              {d.status}
            </span>
            <p className="font-heading text-sm font-bold text-primary">{d.pontos} pts</p>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(d)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
