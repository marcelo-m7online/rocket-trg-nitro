import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, X, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Participante {
  id: string;
  nome: string;
  pontos: number;
  created_at: string;
}

export default function AdminFormulaTruck() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: "", pontos: "" });
  const [saving, setSaving] = useState(false);
  const [participantes, setParticipantes] = useState<Participante[]>([]);

  useEffect(() => {
    loadParticipantes();
  }, []);

  const loadParticipantes = async () => {
    // Try to load from Supabase first
    try {
      const { data, error } = await supabase.from("formula_truck_ranking").select("*").order("pontos", { ascending: false });
      if (!error && data) {
        setParticipantes(data);
        localStorage.setItem("formula_truck_backup", JSON.stringify(data));
        return;
      }
    } catch (e) {
      console.log("Supabase not available, using localStorage");
    }

    // Fallback to localStorage
    const saved = localStorage.getItem("formula_truck_backup");
    if (saved) {
      setParticipantes(JSON.parse(saved));
    }
  };

  const handleSave = async () => {
    if (!form.nome) {
      toast.error("Nome do participante é obrigatório");
      return;
    }
    if (!form.pontos || isNaN(Number(form.pontos))) {
      toast.error("Pontos devem ser um número válido");
      return;
    }

    setSaving(true);
    const newParticipante: Participante = {
      id: editingId || `temp_${Date.now()}`,
      nome: form.nome,
      pontos: Number(form.pontos),
      created_at: new Date().toISOString(),
    };

    try {
      if (editingId) {
        // Try Supabase update
        const { error } = await supabase.from("formula_truck_ranking").update({
          nome: form.nome,
          pontos: Number(form.pontos),
        }).eq("id", editingId);

        if (!error) {
          toast.success("Atualizado!");
        } else {
          throw error;
        }
      } else {
        // Try Supabase insert
        const { error } = await supabase.from("formula_truck_ranking").insert({
          nome: form.nome,
          pontos: Number(form.pontos),
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
      let updated = participantes.filter(p => p.id !== newParticipante.id);
      updated.unshift(newParticipante);
      updated.sort((a, b) => b.pontos - a.pontos);
      setParticipantes(updated);
      localStorage.setItem("formula_truck_backup", JSON.stringify(updated));
      toast.success(editingId ? "Atualizado!" : "Adicionado!");
    }

    setSaving(false);
    setForm({ nome: "", pontos: "" });
    setEditingId(null);
    setShowForm(false);
    await loadParticipantes();
  };

  const handleEdit = (p: Participante) => {
    setEditingId(p.id);
    setForm({ nome: p.nome, pontos: String(p.pontos) });
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({ nome: "", pontos: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir participante?")) return;

    try {
      const { error } = await supabase.from("formula_truck_ranking").delete().eq("id", id);
      if (!error) {
        toast.success("Excluído!");
      } else {
        throw error;
      }
    } catch (e) {
      // Fallback: delete from localStorage
      const updated = participantes.filter(p => p.id !== id);
      setParticipantes(updated);
      localStorage.setItem("formula_truck_backup", JSON.stringify(updated));
      toast.success("Excluído!");
    }

    await loadParticipantes();
  };

  const sorted = [...participantes].sort((a, b) => b.pontos - a.pontos);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-gradient-fire" />
          <h2 className="font-heading text-2xl font-bold text-gradient-fire">FÓRMULA TRUCK</h2>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-fire text-primary-foreground font-heading text-xs">
          <Plus className="h-4 w-4 mr-1" /> NOVO PARTICIPANTE
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex justify-between">
            <h3 className="font-heading text-sm font-bold">{editingId ? "EDITAR" : "ADICIONAR PARTICIPANTE"}</h3>
            <button onClick={handleCancel}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-display">Nome do Participante</Label>
            <Input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Ex: TRG Galvão"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-display">Pontos</Label>
            <Input
              type="number"
              value={form.pontos}
              onChange={(e) => setForm({ ...form, pontos: e.target.value })}
              placeholder="0"
            />
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-fire text-primary-foreground font-heading text-xs w-full">
            {saving ? "SALVANDO..." : "SALVAR"}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum participante adicionado. Clique em "NOVO PARTICIPANTE" para começar.
          </div>
        ) : (
          sorted.map((p, index) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-gradient-fire transition-all group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-fire text-primary-foreground font-heading font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-sm">{p.nome}</h3>
                  <p className="text-xs text-muted-foreground">
                    {index === 0 && "🥇 Liderança"}
                    {index === 1 && "🥈 2º Lugar"}
                    {index === 2 && "🥉 3º Lugar"}
                  </p>
                </div>
              </div>
              <div className="text-right mr-4">
                <p className="font-heading text-lg font-bold text-gradient-fire">{p.pontos}</p>
                <p className="text-xs text-muted-foreground">pontos</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(p)} className="text-xs">
                  Editar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)} className="text-xs">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
