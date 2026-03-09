import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Edit, X, Upload } from "lucide-react";

interface TruckForm {
  nome: string;
  marca: string;
  modelo: string;
  ano: string;
  placa: string;
  driver_id: string;
  descricao: string;
  status: string;
}

const emptyForm: TruckForm = { nome: "", marca: "", modelo: "", ano: "", placa: "", driver_id: "", descricao: "", status: "ativo" };

export default function AdminCaminhoes() {
  const qc = useQueryClient();
  const [form, setForm] = useState<TruckForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: trucks } = useQuery({
    queryKey: ["admin-caminhoes"],
    queryFn: async () => {
      const { data } = await supabase.from("caminhoes").select("*, drivers(nickname)").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: drivers } = useQuery({
    queryKey: ["admin-drivers-list"],
    queryFn: async () => {
      const { data } = await supabase.from("drivers").select("id, nickname").eq("status", "ativo").order("nickname");
      return data || [];
    },
  });

  const handleSave = async () => {
    if (!form.nome) { toast.error("Nome obrigatório"); return; }
    setUploading(true);

    try {
      let imagem_url: string | undefined;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("caminhoes").upload(path, file);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("caminhoes").getPublicUrl(path);
        imagem_url = data.publicUrl;
      }

      const payload: any = {
        nome: form.nome, marca: form.marca || null, modelo: form.modelo || null,
        ano: form.ano || null, placa: form.placa || null,
        driver_id: form.driver_id || null, descricao: form.descricao || null,
        status: form.status,
      };
      if (imagem_url) payload.imagem_url = imagem_url;

      if (editingId) {
        const { error } = await supabase.from("caminhoes").update(payload).eq("id", editingId);
        if (error) { toast.error("Erro ao atualizar"); return; }
        toast.success("Caminhão atualizado!");
      } else {
        const { error } = await supabase.from("caminhoes").insert(payload);
        if (error) { toast.error("Erro ao cadastrar"); return; }
        toast.success("Caminhão cadastrado!");
      }

      setForm(emptyForm); setEditingId(null); setShowForm(false); setFile(null);
      qc.invalidateQueries({ queryKey: ["admin-caminhoes"] });
    } catch {
      toast.error("Erro no upload");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (t: any) => {
    setForm({
      nome: t.nome, marca: t.marca || "", modelo: t.modelo || "", ano: t.ano || "",
      placa: t.placa || "", driver_id: t.driver_id || "", descricao: t.descricao || "", status: t.status,
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from("caminhoes").delete().eq("id", id);
    toast.success("Excluído!");
    qc.invalidateQueries({ queryKey: ["admin-caminhoes"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gradient-fire">CAMINHÕES</h2>
        <Button onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditingId(null); }} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
          <Plus className="h-4 w-4 mr-1" /> NOVO
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-sm font-bold text-foreground">{editingId ? "EDITAR" : "NOVO"} CAMINHÃO</h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); }}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label className="text-xs font-display">Nome</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Marca</Label>
              <Input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Modelo</Label>
              <Input value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Ano</Label>
              <Input value={form.ano} onChange={(e) => setForm({ ...form, ano: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Placa</Label>
              <Input value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Motorista</Label>
              <select value={form.driver_id} onChange={(e) => setForm({ ...form, driver_id: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Nenhum</option>
                {(drivers || []).map((d) => <option key={d.id} value={d.id}>{d.nickname}</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label className="text-xs font-display">Status</Label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="ativo">Ativo</option><option value="inativo">Inativo</option><option value="manutenção">Manutenção</option>
              </select>
            </div>
          </div>
          <div className="space-y-1"><Label className="text-xs font-display">Descrição</Label>
            <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} /></div>
          <div className="space-y-1"><Label className="text-xs font-display">Imagem</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
          <Button onClick={handleSave} disabled={uploading} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
            <Upload className="h-4 w-4 mr-1" /> {uploading ? "SALVANDO..." : editingId ? "ATUALIZAR" : "CADASTRAR"}
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {(trucks || []).map((t: any) => (
          <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all">
            {t.imagem_url && <img src={t.imagem_url} alt={t.nome} className="w-16 h-10 rounded object-cover border border-border" />}
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-foreground text-sm truncate">{t.nome}</p>
              <p className="text-xs text-muted-foreground">{t.marca} {t.modelo} • {t.drivers?.nickname || "Sem motorista"}</p>
            </div>
            <span className={`text-xs font-display px-2 py-1 rounded-full ${t.status === "ativo" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
              {t.status}
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
