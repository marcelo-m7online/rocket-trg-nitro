import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Edit, X, Upload } from "lucide-react";

const empty = { titulo: "", conteudo: "", autor: "", slug: "", publicado: true };

export default function AdminBlog() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: posts } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("blog_posts").select("*").order("data_publicacao", { ascending: false });
        if (error) throw error;
        if (data) {
          localStorage.setItem("admin_blog_backup", JSON.stringify(data));
          const published = data.filter((p: any) => p.publicado).slice(0, 3);
          localStorage.setItem("latest_posts_backup", JSON.stringify(published));
        }
        return data || [];
      } catch (err) {
        console.error("Erro ao carregar posts no admin:", err);
        const saved = localStorage.getItem("admin_blog_backup");
        return saved ? JSON.parse(saved) : [];
      }
    },
  });

  const handleSave = async () => {
    if (!form.titulo || !form.conteudo || !form.autor) { toast.error("Título, conteúdo e autor obrigatórios"); return; }
    setUploading(true);
    let imagem_capa: string | null = null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: ue } = await supabase.storage.from("blog").upload(path, file);
      if (ue) { toast.error("Erro upload"); setUploading(false); return; }
      const { data: ud } = supabase.storage.from("blog").getPublicUrl(path);
      imagem_capa = ud.publicUrl;
    }
    const slug = form.slug || form.titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const payload: any = { titulo: form.titulo, conteudo: form.conteudo, autor: form.autor, slug, publicado: form.publicado };
    if (imagem_capa) payload.imagem_capa = imagem_capa;

    if (editingId) {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingId);
      if (error) { toast.error("Erro"); setUploading(false); return; }
      toast.success("Post atualizado!");
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) { toast.error("Erro"); setUploading(false); return; }
      toast.success("Post criado!");
    }
    setUploading(false); setForm(empty); setFile(null); setEditingId(null); setShowForm(false);
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
  };

  const handleEdit = (p: any) => {
    setForm({ titulo: p.titulo, conteudo: p.conteudo, autor: p.autor, slug: p.slug || "", publicado: p.publicado });
    setEditingId(p.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("Excluído!"); qc.invalidateQueries({ queryKey: ["admin-blog"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gradient-fire">BLOG & NOTÍCIAS</h2>
        <Button onClick={() => { setShowForm(!showForm); setForm(empty); setEditingId(null); }} className="bg-gradient-fire text-primary-foreground font-heading text-xs"><Plus className="h-4 w-4 mr-1" /> NOVO POST</Button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex justify-between"><h3 className="font-heading text-sm font-bold">{editingId ? "EDITAR" : "NOVO"} POST</h3><button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label className="text-xs font-display">Título</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Autor</Label><Input value={form.autor} onChange={(e) => setForm({ ...form, autor: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Slug (URL)</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-gerado" /></div>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" checked={form.publicado} onChange={(e) => setForm({ ...form, publicado: e.target.checked })} className="rounded" />
              <Label className="text-xs font-display">Publicado</Label>
            </div>
          </div>
          <div className="space-y-1"><Label className="text-xs font-display">Conteúdo</Label><Textarea value={form.conteudo} onChange={(e) => setForm({ ...form, conteudo: e.target.value })} rows={6} /></div>
          <div className="space-y-1"><Label className="text-xs font-display">Imagem de Capa</Label><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
          <Button onClick={handleSave} disabled={uploading} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
            {uploading ? "SALVANDO..." : editingId ? "ATUALIZAR" : "PUBLICAR"}
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {(posts || []).map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
            {p.imagem_capa && <img src={p.imagem_capa} alt="" className="w-12 h-12 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm truncate">{p.titulo}</p>
              <p className="text-xs text-muted-foreground">por {p.autor}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-display ${p.publicado ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
              {p.publicado ? "Publicado" : "Rascunho"}
            </span>
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
