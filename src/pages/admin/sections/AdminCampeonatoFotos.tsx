import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CampeonatoFoto {
  id: string;
  titulo: string;
  descricao?: string;
  imagem_url: string;
  created_at: string;
}

export default function AdminCampeonatoFotos() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ titulo: "", descricao: "", imagem_url_input: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<CampeonatoFoto[]>([]);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    // Try to load from Supabase first
    try {
      const { data, error } = await supabase.from("campeonato_fotos").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        setPhotos(data);
        localStorage.setItem("campeonato_fotos_backup", JSON.stringify(data));
        return;
      }
    } catch (e) {
      console.log("Supabase not available, using localStorage");
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem("campeonato_fotos_backup");
    if (saved) {
      setPhotos(JSON.parse(saved));
    }
  };

  const handleSave = async () => {
    if (!form.titulo) { toast.error("Título é obrigatório"); return; }
    
    setUploading(true);
    let imageUrl = form.imagem_url_input;

    if (file) {
      try {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("campeonato_fotos").upload(path, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("campeonato_fotos").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      } catch (err) {
        toast.error("Erro ao fazer upload do arquivo");
        setUploading(false);
        return;
      }
    }

    if (!imageUrl) {
      toast.error("Selecione um arquivo de imagem ou forneça uma URL");
      setUploading(false);
      return;
    }

    const newPhoto: CampeonatoFoto = {
      id: editingId || `temp_${Date.now()}`,
      titulo: form.titulo,
      descricao: form.descricao || "",
      imagem_url: imageUrl,
      created_at: new Date().toISOString(),
    };

    try {
      if (editingId) {
        // Try Supabase update
        const { error } = await supabase.from("campeonato_fotos").update({
          titulo: form.titulo,
          descricao: form.descricao,
          imagem_url: imageUrl,
        }).eq("id", editingId);

        if (!error) {
          toast.success("Atualizado!");
        } else {
          throw error;
        }
      } else {
        // Try Supabase insert
        const { error } = await supabase.from("campeonato_fotos").insert({
          titulo: form.titulo,
          descricao: form.descricao,
          imagem_url: imageUrl,
        });

        if (!error) {
          toast.success("Adicionado!");
        } else {
          throw error;
        }
      }
    } catch (e) {
      console.log("Supabase save failed, using localStorage");
      // Fallback: save to localStorage
      let updated = photos.filter(p => p.id !== newPhoto.id);
      updated.unshift(newPhoto);
      setPhotos(updated);
      localStorage.setItem("campeonato_fotos_backup", JSON.stringify(updated));
      toast.success(editingId ? "Atualizado!" : "Adicionado!");
    }

    setUploading(false);
    setForm({ titulo: "", descricao: "", imagem_url_input: "" });
    setFile(null);
    setEditingId(null);
    setShowForm(false);
    await loadPhotos();
  };

  const handleEdit = (photo: CampeonatoFoto) => {
    setEditingId(photo.id);
    setForm({ titulo: photo.titulo, descricao: photo.descricao || "", imagem_url_input: photo.imagem_url });
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({ titulo: "", descricao: "", imagem_url_input: "" });
    setFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir campeonato?")) return;

    try {
      const { error } = await supabase.from("campeonato_fotos").delete().eq("id", id);
      if (!error) {
        toast.success("Excluído!");
      } else {
        throw error;
      }
    } catch (e) {
      // Fallback: delete from localStorage
      const updated = photos.filter(p => p.id !== id);
      setPhotos(updated);
      localStorage.setItem("campeonato_fotos_backup", JSON.stringify(updated));
      toast.success("Excluído!");
    }

    await loadPhotos();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gradient-fire">1º CAMPEONATO DE FOTOS</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
          <Plus className="h-4 w-4 mr-1" /> NOVO
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex justify-between">
            <h3 className="font-heading text-sm font-bold">{editingId ? "EDITAR" : "ADICIONAR CAMPEONATO"}</h3>
            <button onClick={handleCancel}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-display">Título</Label>
            <Input
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Nome do campeonato..."
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-display">Descrição</Label>
            <Textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Descrição do campeonato..."
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-display">Arquivo de Imagem (JPG, PNG)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-display">Ou URL da Imagem</Label>
            <Input
              value={form.imagem_url_input}
              onChange={(e) => setForm({ ...form, imagem_url_input: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
              type="url"
            />
          </div>
          <Button onClick={handleSave} disabled={uploading} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
            <Upload className="h-4 w-4 mr-1" /> {uploading ? "ENVIANDO..." : "SALVAR"}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="rounded-xl overflow-hidden border border-border">
            <img src={photo.imagem_url} alt={photo.titulo} className="w-full aspect-video object-cover" />
            <div className="p-4 bg-card space-y-2">
              <h3 className="font-heading font-bold text-sm">{photo.titulo}</h3>
              {photo.descricao && <p className="text-xs text-muted-foreground">{photo.descricao}</p>}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(photo)} className="text-xs flex-1">
                  Editar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(photo.id)} className="text-xs">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && !showForm && (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum campeonato adicionado. Clique em "NOVO" para começar.
        </div>
      )}
    </div>
  );
}
