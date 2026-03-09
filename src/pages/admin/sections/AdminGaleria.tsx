import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, X, Upload } from "lucide-react";

export default function AdminGaleria() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titulo: "", categoria: "comboio", descricao: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: photos } = useQuery({
    queryKey: ["admin-galeria"],
    queryFn: async () => {
      const { data } = await supabase.from("galeria").select("*").order("data", { ascending: false });
      return data || [];
    },
  });

  const handleSave = async () => {
    if (!form.titulo || !file) { toast.error("Título e imagem são obrigatórios"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("galeria").upload(path, file);
    if (uploadError) { toast.error("Erro ao fazer upload"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("galeria").getPublicUrl(path);
    const { error } = await supabase.from("galeria").insert({
      titulo: form.titulo,
      imagem_url: urlData.publicUrl,
      categoria: form.categoria,
      descricao: form.descricao || null,
    });
    setUploading(false);
    if (error) { toast.error("Erro ao salvar"); return; }
    toast.success("Foto adicionada!");
    setForm({ titulo: "", categoria: "comboio", descricao: "" }); setFile(null); setShowForm(false);
    qc.invalidateQueries({ queryKey: ["admin-galeria"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from("galeria").delete().eq("id", id);
    toast.success("Excluída!"); qc.invalidateQueries({ queryKey: ["admin-galeria"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gradient-fire">GALERIA</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-fire text-primary-foreground font-heading text-xs"><Plus className="h-4 w-4 mr-1" /> NOVA FOTO</Button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex justify-between"><h3 className="font-heading text-sm font-bold">ENVIAR FOTO</h3><button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label className="text-xs font-display">Título</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Categoria</Label>
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="comboio">Comboio</option><option value="viagem">Viagem</option><option value="evento">Evento</option><option value="outro">Outro</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-display">Descrição</Label>
            <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição da imagem..." rows={2} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-display">Imagem</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <Button onClick={handleSave} disabled={uploading} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
            <Upload className="h-4 w-4 mr-1" /> {uploading ? "ENVIANDO..." : "ENVIAR"}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(photos || []).map((p: any) => (
          <div key={p.id} className="rounded-xl overflow-hidden border border-border group relative">
            <img src={p.imagem_url} alt={p.titulo} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <p className="text-xs font-display font-bold text-foreground">{p.titulo}</p>
              {p.descricao && <p className="text-xs text-muted-foreground px-2 text-center">{p.descricao}</p>}
              <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}><Trash2 className="h-3 w-3 mr-1" /> Excluir</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
