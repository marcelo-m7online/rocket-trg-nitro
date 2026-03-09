import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit, X, Radio } from "lucide-react";

interface LiveForm { titulo: string; plataforma: string; url: string; streamer: string; ativa: boolean; }
const emptyForm: LiveForm = { titulo: "", plataforma: "twitch", url: "", streamer: "", ativa: true };

export default function AdminLives() {
  const qc = useQueryClient();
  const [form, setForm] = useState<LiveForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: lives } = useQuery({
    queryKey: ["admin-lives"],
    queryFn: async () => {
      const { data } = await supabase.from("lives").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const handleSave = async () => {
    if (!form.titulo || !form.url || !form.streamer) { toast.error("Preencha todos os campos"); return; }
    const payload = { titulo: form.titulo, plataforma: form.plataforma, url: form.url, streamer: form.streamer, ativa: form.ativa };

    if (editingId) {
      const { error } = await supabase.from("lives").update(payload).eq("id", editingId);
      if (error) { toast.error("Erro"); return; }
      toast.success("Live atualizada!");
    } else {
      const { error } = await supabase.from("lives").insert(payload);
      if (error) { toast.error("Erro"); return; }
      toast.success("Live cadastrada!");
    }
    setForm(emptyForm); setEditingId(null); setShowForm(false);
    qc.invalidateQueries({ queryKey: ["admin-lives"] });
  };

  const handleEdit = (l: any) => {
    setForm({ titulo: l.titulo, plataforma: l.plataforma, url: l.url, streamer: l.streamer, ativa: l.ativa });
    setEditingId(l.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from("lives").delete().eq("id", id);
    toast.success("Excluída!"); qc.invalidateQueries({ queryKey: ["admin-lives"] });
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("lives").update({ ativa: !current }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-lives"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gradient-fire">LIVES</h2>
        <Button onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditingId(null); }} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
          <Plus className="h-4 w-4 mr-1" /> NOVA LIVE
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex justify-between"><h3 className="font-heading text-sm font-bold text-foreground">{editingId ? "EDITAR" : "NOVA"} LIVE</h3>
            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label className="text-xs font-display">Título</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Streamer</Label><Input value={form.streamer} onChange={(e) => setForm({ ...form, streamer: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs font-display">URL</Label><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://twitch.tv/..." /></div>
            <div className="space-y-1"><Label className="text-xs font-display">Plataforma</Label>
              <select value={form.plataforma} onChange={(e) => setForm({ ...form, plataforma: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="twitch">Twitch</option><option value="youtube">YouTube</option><option value="kick">Kick</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.ativa} onChange={(e) => setForm({ ...form, ativa: e.target.checked })} className="rounded" />
            <Label className="text-xs font-display">Ativa (mostrar na home)</Label>
          </div>
          <Button onClick={handleSave} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
            {editingId ? "ATUALIZAR" : "CADASTRAR"}
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {(lives || []).map((l: any) => (
          <div key={l.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all">
            <Radio className={`h-5 w-5 ${l.ativa ? "text-green-400 animate-pulse" : "text-muted-foreground"}`} />
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-foreground text-sm truncate">{l.titulo}</p>
              <p className="text-xs text-muted-foreground">{l.streamer} • {l.plataforma}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => toggleActive(l.id, l.ativa)} className="text-xs font-display">
              {l.ativa ? "Desativar" : "Ativar"}
            </Button>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(l)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
