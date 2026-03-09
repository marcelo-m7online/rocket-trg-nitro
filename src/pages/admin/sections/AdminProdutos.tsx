import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Edit, X, Upload } from "lucide-react";

const empty = { nome: "", descricao: "", preco: "", estoque: "", categoria: "geral", ativo: true };

export default function AdminProdutos() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: produtos } = useQuery({
    queryKey: ["admin-produtos"],
    queryFn: async () => {
      const { data } = await supabase.from("produtos").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const handleSave = async () => {
    if (!form.nome || !form.preco) { toast.error("Nome e preço obrigatórios"); return; }
    setUploading(true);
    let imagem_url: string | null = null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: ue } = await supabase.storage.from("produtos").upload(path, file);
      if (ue) { toast.error("Erro upload"); setUploading(false); return; }
      const { data: ud } = supabase.storage.from("produtos").getPublicUrl(path);
      imagem_url = ud.publicUrl;
    }
    const payload: any = {
      nome: form.nome, descricao: form.descricao || null,
      preco: parseFloat(form.preco), estoque: parseInt(form.estoque) || 0,
      categoria: form.categoria, ativo: form.ativo,
    };
    if (imagem_url) payload.imagem_url = imagem_url;

    if (editingId) {
      const { error } = await supabase.from("produtos").update(payload).eq("id", editingId);
      if (error) { toast.error("Erro"); setUploading(false); return; }
      toast.success("Produto atualizado!");
    } else {
      const { error } = await supabase.from("produtos").insert(payload);
      if (error) { toast.error("Erro"); setUploading(false); return; }
      toast.success("Produto cadastrado!");
    }
    setUploading(false); setForm(empty); setFile(null); setEditingId(null); setShowForm(false);
    qc.invalidateQueries({ queryKey: ["admin-produtos"] });
  };

  const handleEdit = (p: any) => {
    setForm({ nome: p.nome, descricao: p.descricao || "", preco: String(p.preco), estoque: String(p.estoque), categoria: p.categoria || "geral", ativo: p.ativo });
    setEditingId(p.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from("produtos").delete().eq("id", id);
    toast.success("Excluído!"); qc.invalidateQueries({ queryKey: ["admin-produtos"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gradient-fire">PRODUTOS</h2>
        <Button onClick={() => { setShowForm(!showForm); setForm(empty); setEditingId(null); }} className="bg-gradient-fire text-primary-foreground font-heading text-xs"><Plus className="h-4 w-4 mr-1" /> NOVO</Button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex justify-between"><h3 className="font-heading text-sm font-bold">{editingId ? "EDITAR" : "NOVO"} PRODUTO</h3><button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label className="text-xs font-display">Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Preço (R$)</Label><Input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Estoque</Label><Input type="number" value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Categoria</Label><Input value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} /></div>
          </div>
          <div className="space-y-1"><Label className="text-xs font-display">Descrição</Label><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} /></div>
          <div className="space-y-1"><Label className="text-xs font-display">Imagem</Label><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
          <Button onClick={handleSave} disabled={uploading} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
            {uploading ? "SALVANDO..." : editingId ? "ATUALIZAR" : "CADASTRAR"}
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {(produtos || []).map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
            {p.imagem_url && <img src={p.imagem_url} alt={p.nome} className="w-12 h-12 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm truncate">{p.nome}</p>
              <p className="text-xs text-muted-foreground">{p.categoria} • Estoque: {p.estoque}</p>
            </div>
            <p className="font-heading text-sm font-bold text-primary">R$ {Number(p.preco).toFixed(2).replace(".", ",")}</p>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
